// Handles product rendering, category filtering, cart operations, and local storage per restaurant brand.

// --- Restaurant Configuration ---

const currentBrandSlug = window.CURRENT_BRAND_SLUG || 'burger';

// Maps each restaurant slug to its localStorage cart key and menu items getter
const BRAND_CONFIGS = {
    'burger': {
        cartKey: 'tableCoCart',
        getItems: function () { return typeof menuItems !== 'undefined' ? menuItems : []; }
    },
    'pizza': {
        cartKey: 'tableCoCart_pizza',
        getItems: function () { return typeof pizzaMenuItems !== 'undefined' ? pizzaMenuItems : []; }
    },
    'coffee': {
        cartKey: 'tableCoCart_coffee',
        getItems: function () { return typeof coffeeMenuItems !== 'undefined' ? coffeeMenuItems : []; }
    }
};

const currentBrand = BRAND_CONFIGS[currentBrandSlug] || BRAND_CONFIGS['burger'];

// Each restaurant uses a separate localStorage key so carts remain independent.
const CART_KEY = currentBrand.cartKey;
const TAX_RATE = 0.10;
const FREE_DELIVERY_THRESHOLD = 499;
const STANDARD_DELIVERY_FEE = 40;

// --- State ---

let activeCategory = 'All';
let cart = [];
let toastTimeout = null;

// --- Startup ---

document.addEventListener('DOMContentLoaded', function () {
    loadCart();
    setupCategoryFilters();
    setupCartEvents();
    renderMenu();
    renderCart();
});

// Returns the menu items array for the active restaurant brand.
function getMenuItems() {
    return currentBrand.getItems();
}

// Saves the cart array to localStorage.
function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Loads and parses the restaurant's cart from localStorage.
function loadCart() {
    var stored = localStorage.getItem(CART_KEY);
    if (!stored) {
        cart = [];
        return;
    }

    var parsed;
    try {
        parsed = JSON.parse(stored);
    } catch (e) {
        cart = [];
        return;
    }

    if (!Array.isArray(parsed)) {
        cart = [];
        return;
    }

    var menuList = getMenuItems();

    cart = parsed.filter(function (item) {
        if (!item || !item.productId || !item.quantity) return false;
        if (item.quantity <= 0) return false;
        return menuList.some(function (p) { return p.id === item.productId; });
    }).map(function (item) {
        return { productId: item.productId, quantity: item.quantity };
    });
}

// Adds a product to the cart or increments its quantity.
function addToCart(productId) {
    var existing = cart.find(function (item) { return item.productId === productId; });

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ productId: productId, quantity: 1 });
    }

    saveCart();
    renderCart();

    var product = getMenuItems().find(function (p) { return p.id === productId; });
    if (product) {
        showToast(product.name + ' added to cart');
    }
}

// Adjusts item quantity in the cart or removes it if quantity reaches zero.
function updateCartQuantity(productId, action) {
    var index = cart.findIndex(function (item) { return item.productId === productId; });
    if (index === -1) return;

    if (action === 'increase') {
        cart[index].quantity += 1;
    } else if (action === 'decrease') {
        cart[index].quantity -= 1;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
    }

    saveCart();
    renderCart();
}

// Displays a temporary toast notification.
function showToast(message) {
    var toast = document.getElementById('cart-toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(function () {
        toast.classList.remove('show');
    }, 1800);
}

// Handles category pill selection and filters product view.
function setupCategoryFilters() {
    var buttons = document.querySelectorAll('.pill-btn');

    buttons.forEach(function (button) {
        button.addEventListener('click', function () {
            var selected = button.getAttribute('data-category');
            if (!selected || selected === activeCategory) return;

            activeCategory = selected;

            buttons.forEach(function (btn) {
                var isActive = btn.getAttribute('data-category') === activeCategory;
                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });

            renderMenu();
        });
    });
}

// Renders products into the grid based on the active category filter.
function renderMenu() {
    var grid = document.getElementById('product-grid');
    if (!grid) return;

    var allItems = getMenuItems();
    var products = (activeCategory === 'All')
        ? allItems
        : allItems.filter(function (item) { return item.category === activeCategory; });

    if (products.length === 0) {
        grid.innerHTML = '<div class="empty-state"><p>No items available yet.</p></div>';
        return;
    }

    grid.innerHTML = products.map(function (product) {
        return '<article class="product-card" data-id="' + product.id + '">'
            + '<div class="card-image-wrap">'
            +   '<button type="button" class="btn-favorite" aria-label="Add ' + product.name + ' to favorites">'
            +     '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
            +       '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>'
            +     '</svg>'
            +   '</button>'
            +   '<img src="' + product.image + '" alt="' + product.name + '" class="card-img" />'
            + '</div>'
            + '<div class="card-content">'
            +   '<h3 class="product-title">' + product.name + '</h3>'
            +   '<p class="product-desc">' + product.description + '</p>'
            +   '<div class="card-footer">'
            +     '<span class="product-price">₹' + product.price + '</span>'
            +     '<button type="button" class="btn-add" data-product-id="' + product.id + '">Add +</button>'
            +   '</div>'
            + '</div>'
            + '</article>';
    }).join('');
}

// Updates the cart sidebar items, quantities, badge count, and price summary.
function renderCart() {
    var badge    = document.getElementById('cart-badge');
    var list     = document.getElementById('cart-items-list');
    var elSub    = document.getElementById('cart-subtotal');
    var elDel    = document.getElementById('cart-delivery');
    var elTax    = document.getElementById('cart-tax');
    var elTotal  = document.getElementById('cart-total');
    var btnCheckout = document.getElementById('btn-checkout');

    var totalCount = cart.reduce(function (sum, item) { return sum + item.quantity; }, 0);
    if (badge) badge.textContent = totalCount;

    if (cart.length === 0) {
        if (list) {
            list.innerHTML = '<div class="cart-empty-state">'
                + '<p class="cart-empty-title">Your cart is empty.</p>'
                + '<p class="cart-empty-text">Add something delicious to get started.</p>'
                + '</div>';
        }
        if (elSub)   elSub.textContent   = '₹0';
        if (elDel)   elDel.textContent   = '₹0';
        if (elTax)   elTax.textContent   = '₹0';
        if (elTotal) elTotal.textContent = '₹0';
        if (btnCheckout) btnCheckout.disabled = true;
        return;
    }

    var menuList = getMenuItems();
    var subtotal = 0;

    var itemsHTML = cart.map(function (cartItem) {
        var product = menuList.find(function (p) { return p.id === cartItem.productId; });
        if (!product) return '';

        var itemTotal = product.price * cartItem.quantity;
        subtotal += itemTotal;

        return '<div class="cart-item" data-product-id="' + product.id + '">'
            + '<img src="' + product.image + '" alt="' + product.name + '" class="cart-item-img" />'
            + '<div class="cart-item-info">'
            +   '<h3 class="cart-item-name">' + product.name + '</h3>'
            +   '<span class="cart-item-price">₹' + product.price + '</span>'
            + '</div>'
            + '<div class="qty-control">'
            +   '<button type="button" class="qty-btn" data-action="decrease" data-product-id="' + product.id + '" aria-label="Decrease quantity">−</button>'
            +   '<span class="qty-val">' + cartItem.quantity + '</span>'
            +   '<button type="button" class="qty-btn" data-action="increase" data-product-id="' + product.id + '" aria-label="Increase quantity">+</button>'
            + '</div>'
            + '</div>';
    }).join('');

    if (list) list.innerHTML = itemsHTML;

    var deliveryFee = (subtotal >= FREE_DELIVERY_THRESHOLD) ? 0 : STANDARD_DELIVERY_FEE;
    var tax   = Math.round(subtotal * TAX_RATE);
    var total = subtotal + deliveryFee + tax;

    if (elSub)   elSub.textContent   = '₹' + subtotal;
    if (elDel)   elDel.textContent   = (deliveryFee === 0) ? 'Free' : '₹' + deliveryFee;
    if (elTax)   elTax.textContent   = '₹' + tax;
    if (elTotal) elTotal.textContent = '₹' + total;

    if (btnCheckout) btnCheckout.disabled = false;
}

// Attaches event listeners for add-to-cart, cart quantity changes, and checkout.
function setupCartEvents() {
    var grid = document.getElementById('product-grid');
    if (grid) {
        grid.addEventListener('click', function (event) {
            var btn = event.target.closest('.btn-add');
            if (!btn) return;
            var productId = parseInt(btn.getAttribute('data-product-id'), 10);
            if (!isNaN(productId)) addToCart(productId);
        });
    }

    var sidebar = document.getElementById('cart-sidebar');
    if (sidebar) {
        sidebar.addEventListener('click', function (event) {
            var btn = event.target.closest('.qty-btn');
            if (!btn) return;
            var action    = btn.getAttribute('data-action');
            var productId = parseInt(btn.getAttribute('data-product-id'), 10);
            if (action && !isNaN(productId)) updateCartQuantity(productId, action);
        });
    }

    var btnCheckout = document.getElementById('btn-checkout');
    if (btnCheckout) {
        btnCheckout.addEventListener('click', function () {
            if (cart.length === 0) return;

            if (typeof isLoggedIn === 'function' && !isLoggedIn()) {
                localStorage.setItem('tableCoReturnUrl', '../checkout/checkout.html');
                window.location.href = '../auth/login.html';
            } else {
                window.location.href = '../checkout/checkout.html';
            }
        });
    }
}
