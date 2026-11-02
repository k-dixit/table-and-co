// Handles order checkout, customer details pre-filling, cart summary, and order placement.


var CART_STORAGE_KEY = "tableCoCart";
var LAST_ORDER_KEY = "tableCoLastOrder";
var TAX_RATE = 0.10;
var DELIVERY_THRESHOLD = 499;
var DELIVERY_FEE = 40;

var CHECKOUT_API_URL = "http://localhost:5000/api";
var checkoutCart = [];
var cart = checkoutCart;

var restaurant = new URLSearchParams(window.location.search)
    .get("restaurant") || "burger";

var restaurantConfig = {
    burger: {
        cartKey: "tableCoCart",
        menu: typeof menuItems !== "undefined" ? menuItems : [],
        successName: "Burger District"
    },
    pizza: {
        cartKey: "tableCoCart_pizza",
        menu: typeof pizzaMenuItems !== "undefined" ? pizzaMenuItems : [],
        successName: "Pizza Palace"
    },
    coffee: {
        cartKey: "tableCoCart_coffee",
        menu: typeof coffeeMenuItems !== "undefined" ? coffeeMenuItems : [],
        successName: "Brew Bazaar"
    }
};

if (!restaurantConfig[restaurant]) {
    restaurant = "burger";
}

CART_STORAGE_KEY = restaurantConfig[restaurant].cartKey;

function getCheckoutMenu() {
    return restaurantConfig[restaurant].menu;
}


// --- Startup ---

document.addEventListener('DOMContentLoaded', function () {

    // Redirect to login if user is not authenticated
    if (typeof isLoggedIn === 'function' && !isLoggedIn()) {
        localStorage.setItem(
            "tableCoReturnUrl",
            "../checkout/checkout.html?restaurant=" + restaurant
        );
        window.location.href = "../auth/login.html";
        return;
    }

    fillUserDetails();
    loadCart();
    renderSummary();
    setupFormValidation();

    var btn = document.getElementById('btn-place-order');
    if (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            placeOrder();
        });
    }
});

// --- Pre-fill User Details ---

// Pre-fills checkout input fields with the logged-in user's details.
function fillUserDetails() {
    if (typeof getCurrentUser !== 'function') return;
    var user = getCurrentUser();
    if (!user) return;

    var nameEl  = document.getElementById('fullName');
    var emailEl = document.getElementById('email');
    var phoneEl = document.getElementById('phone');

    if (nameEl  && !nameEl.value)  nameEl.value  = user.name  || '';
    if (emailEl && !emailEl.value) emailEl.value = user.email || '';
    if (phoneEl && !phoneEl.value) phoneEl.value = user.phone || '';
}

// --- Cart Data ---

// Reads the active cart from localStorage and validates stored items against the menu.
function loadCart() {
    var stored = localStorage.getItem(CART_STORAGE_KEY);
    cart = [];

    if (!stored) return;

    var parsed;
    try {
        parsed = JSON.parse(stored);
    } catch (e) {
        return;
    }

    if (!Array.isArray(parsed)) return;

    for (var i = 0; i < parsed.length; i++) {
        var item = parsed[i];
        var pId  = parseInt(item.productId, 10);
        var qty  = parseInt(item.quantity, 10);

        if (isNaN(pId) || isNaN(qty) || qty <= 0) continue;

        var activeMenu = getCheckoutMenu();

        if (activeMenu.length > 0) {
            var found = false;

            for (var j = 0; j < activeMenu.length; j++) {
            if (Number(activeMenu[j].id) === pId) {
                found = true;
                break;
            }
        }

        if (!found) continue;
    }   

        cart.push({ productId: pId, quantity: qty });
    }
}

// --- Order Summary ---

// Renders cart items, calculates subtotal, taxes, delivery fee, and order total.
function renderSummary() {
    var itemsContainer  = document.getElementById('summary-items-list');
    var subtotalEl      = document.getElementById('summary-subtotal');
    var deliveryEl      = document.getElementById('summary-delivery');
    var taxEl           = document.getElementById('summary-tax');
    var totalEl         = document.getElementById('summary-total');
    var btnPlaceOrder   = document.getElementById('btn-place-order');

    if (cart.length === 0) {
        if (itemsContainer) {
            itemsContainer.innerHTML =
                '<div class="checkout-empty-state">'
              + '<p class="checkout-empty-title">Your cart is empty.</p>'
              + '<a href="../menu/menu.html" class="btn-return-menu">'
              + '<span>Return to menu</span><span>&rarr;</span></a>'
              + '</div>';
        }
        if (subtotalEl)    subtotalEl.textContent  = '₹0';
        if (deliveryEl)    deliveryEl.textContent   = '₹0';
        if (taxEl)         taxEl.textContent        = '₹0';
        if (totalEl)       totalEl.textContent      = '₹0';
        if (btnPlaceOrder) btnPlaceOrder.disabled   = true;
        return;
    }

    if (btnPlaceOrder) btnPlaceOrder.disabled = false;

    var subtotal  = 0;
    var itemsHTML = '';

    for (var i = 0; i < cart.length; i++) {
        var item    = cart[i];
        var product = getCheckoutMenu().find(function (p) {
            return Number(p.id) === item.productId;
        });
        if (!product) continue;

        var lineTotal = product.price * item.quantity;
        subtotal += lineTotal;

        itemsHTML +=
            '<div class="summary-item" data-product-id="' + product.id + '">'
          + '<img src="' + product.image + '" alt="' + product.name + '" class="summary-item-img" />'
          + '<div class="summary-item-info">'
          + '<h3 class="summary-item-name">' + product.name + '</h3>'
          + '<span class="summary-item-qty-price">Qty ' + item.quantity + ' &bull; ₹' + product.price + ' each</span>'
          + '</div>'
          + '<span class="summary-item-total">₹' + lineTotal + '</span>'
          + '</div>';
    }

    if (itemsContainer) itemsContainer.innerHTML = itemsHTML;

    var delivery = subtotal >= DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    var tax      = Math.round(subtotal * TAX_RATE);
    var total    = subtotal + delivery + tax;

    if (subtotalEl) subtotalEl.textContent = '₹' + subtotal;
    if (deliveryEl) deliveryEl.textContent = delivery === 0 ? 'Free' : '₹' + delivery;
    if (taxEl)      taxEl.textContent      = '₹' + tax;
    if (totalEl)    totalEl.textContent    = '₹' + total;
}

// --- Inline Error Helpers ---

// Displays an inline error message for a specific form field.
function showFieldError(fieldId, message) {
    var group = document.getElementById('group-' + fieldId);
    var span  = document.getElementById('error-' + fieldId);
    if (group) group.classList.add('has-error');
    if (span)  span.textContent = message;
}

// Clears inline error styling and message for a specific form field.
function clearFieldError(fieldId) {
    var group = document.getElementById('group-' + fieldId);
    var span  = document.getElementById('error-' + fieldId);
    if (group) group.classList.remove('has-error');
    if (span)  span.textContent = '';
}

// Attaches real-time input listeners to clear errors as the user types.
function setupFormValidation() {
    var fieldIds = ['fullName', 'phone', 'email', 'address', 'city', 'state', 'pincode'];
    for (var i = 0; i < fieldIds.length; i++) {
        (function (id) {
            var el = document.getElementById(id);
            if (el) el.addEventListener('input', function () { clearFieldError(id); });
        })(fieldIds[i]);
    }
}

// --- Form Validation ---

// Validates Indian mobile phone number format.
function isValidPhone(phoneStr) {
    if (!phoneStr) return false;
    var cleaned = phoneStr.replace(/[\s\-\(\)\+]/g, '');
    if (cleaned.startsWith('91') && cleaned.length > 10) cleaned = cleaned.slice(2);
    return /^\d{10}$/.test(cleaned);
}

// Validates email address format.
function isValidEmail(emailStr) {
    return emailStr ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr.trim()) : false;
}

// Validates all checkout delivery form fields and displays inline errors.
function validateForm() {
    var isValid = true;

    var fields = [
        ['fullName', 'Please enter your full name.',              function (v) { return v.length >= 2; }],
        ['phone',    'Please enter a valid 10-digit phone number.', isValidPhone],
        ['email',    'Please enter a valid email address.',        isValidEmail],
        ['address',  'Please enter your delivery address.',        function (v) { return v.length >= 5; }],
        ['city',     'Please enter your city.',                    function (v) { return v.length > 0; }],
        ['state',    'Please enter your state.',                   function (v) { return v.length > 0; }],
        ['pincode',  'Please enter a valid 6-digit pincode.',      function (v) { return /^\d{6}$/.test(v); }]
    ];

    var firstBadEl = null;

    for (var i = 0; i < fields.length; i++) {
        var fieldId  = fields[i][0];
        var message  = fields[i][1];
        var validate = fields[i][2];

        var el  = document.getElementById(fieldId);
        var val = el ? el.value.trim() : '';

        if (!validate(val)) {
            showFieldError(fieldId, message);
            isValid = false;
            if (!firstBadEl) firstBadEl = el;
        } else {
            clearFieldError(fieldId);
        }
    }

    if (firstBadEl) firstBadEl.focus();
    return isValid;
}

// --- Order Placement ---

// Validates the form, saves order details to localStorage, clears the cart, and redirects to order success page.

async function placeOrder() {
    if (!validateForm()) return;

    loadCart();

    if (cart.length === 0) {
        renderSummary();
        alert("Your cart is empty.");
        return;
    }

    var token = localStorage.getItem("tableCoToken");

    if (!token) {
        localStorage.setItem(
            "tableCoReturnUrl",
            "../checkout/checkout.html?restaurant=" + restaurant
        );
        window.location.href = "../auth/login.html";
        return;
    }

    var button = document.getElementById("btn-place-order");
    var originalButtonText = button ? button.textContent : "";

    if (button) {
        button.disabled = true;
        button.textContent = "Placing Order...";
    }

    var customer = {
        fullName: document.getElementById("fullName").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        address: document.getElementById("address").value.trim(),
        city: document.getElementById("city").value.trim(),
        state: document.getElementById("state").value.trim(),
        pincode: document.getElementById("pincode").value.trim()
    };

    try {
        var response = await fetch(API_URL + "/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                restaurant: restaurant,
                customer: customer,
                items: cart.map(function (item) {
                    return {
                        productId: item.productId,
                        quantity: item.quantity
                    };
                })
            })
        });

        var result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Could not place your order."
            );
        }

        // Store the order returned by the backend.
        localStorage.setItem(
            LAST_ORDER_KEY,
            JSON.stringify(result.data)
        );

        // Clear only this restaurant's cart after successful placement.
        localStorage.removeItem(CART_STORAGE_KEY);

        window.location.href =
            "../order-success/success.html?restaurant=" + restaurant;

    } catch (error) {
        console.error("Order placement failed:", error);
        alert(error.message || "Unable to place order. Please try again.");

        if (button) {
            button.disabled = false;
            button.textContent = originalButtonText;
        }
    }
}

