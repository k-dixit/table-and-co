
const LAST_ORDER_STORAGE_KEY = "tableCoLastOrder";
const SUCCESS_API_URL = "http://localhost:5000/api";

const RESTAURANTS = {
    burger: {
        name: "Burger District",
        menu: typeof menuItems !== "undefined" ? menuItems : [],
        menuUrl: "../menu/menu.html"
    },
    pizza: {
        name: "Pizza Palace",
        menu: typeof pizzaMenuItems !== "undefined" ? pizzaMenuItems : [],
        menuUrl: "../pizza-menu/pizza-menu.html"
    },
    coffee: {
        name: "Brew Bazaar",
        menu: typeof coffeeMenuItems !== "undefined" ? coffeeMenuItems : [],
        menuUrl: "../coffee-menu/coffee-menu.html"
    }
};

document.addEventListener("DOMContentLoaded", function () {
    renderSuccessPage();
});

async function renderSuccessPage() {
    const cardContainer = document.getElementById("success-card");
    if (!cardContainer) return;

    const restaurantSlug =
        new URLSearchParams(window.location.search).get("restaurant") || "burger";

    const restaurant = RESTAURANTS[restaurantSlug] || RESTAURANTS.burger;

    let order = null;

    // Read the order saved by the checkout API response.
    try {
        const stored = localStorage.getItem(LAST_ORDER_STORAGE_KEY);
        if (stored) order = JSON.parse(stored);
    } catch (error) {
        console.error("Could not read saved order:", error);
    }

    // Prefer retrieving the persisted order from MongoDB.
    if (order && order.orderId) {
        const token = localStorage.getItem("tableCoToken");

        if (token) {
            try {
                const response = await fetch(
                    SUCCESS_API_URL + "/orders/" + encodeURIComponent(order.orderId),
                    {
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    }
                );

                const result = await response.json();

                if (response.ok && result.success && result.data) {
                    order = result.data;
                    localStorage.setItem(
                        LAST_ORDER_STORAGE_KEY,
                        JSON.stringify(order)
                    );
                } else {
                    console.warn(
                        "Could not retrieve order from API:",
                        result.message
                    );
                }
            } catch (error) {
                console.error("Could not contact order API:", error);
            }
        }
    }

    if (
        !order ||
        !order.orderId ||
        !Array.isArray(order.items) ||
        order.items.length === 0
    ) {
        cardContainer.innerHTML = `
            <div class="fallback-state">
                <h1 class="fallback-title">No recent order found.</h1>
                <p class="success-subtitle">
                    It looks like you haven't placed an order recently.
                </p>
                <div class="success-actions">
                    <a href="${restaurant.menuUrl}" class="btn-back-menu">
                        <span>Back to Menu</span>
                        <span>&rarr;</span>
                    </a>
                </div>
            </div>
        `;
        return;
    }

    // Use the restaurant stored on the order as the source of truth.
    const orderRestaurant = RESTAURANTS[order.restaurant] || restaurant;
    const activeMenu = orderRestaurant.menu;

    const escapeHTML = function (value) {
        return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[char];
        });
    };

    const money = function (value) {
        return "₹" + Number(value || 0).toFixed(2).replace(/\.00$/, "");
    };

    const itemsHTML = order.items.map(function (item) {
        const product = activeMenu.find(function (p) {
            return Number(p.id) === Number(item.productId);
        });

        const name = item.name || (product ? product.name : "Product #" + item.productId);
        const price = Number(item.price != null ? item.price : product ? product.price : 0);
        const quantity = Number(item.quantity || 0);
        const image = item.image || (product ? product.image : "../assets/burger.png");

        return `
            <div class="item-row">
                <div class="item-left">
                    <img src="${escapeHTML(image)}"
                         alt="${escapeHTML(name)}"
                         class="item-img" />
                    <div>
                        <div class="item-name">${escapeHTML(name)}</div>
                        <div class="item-qty">
                            Qty ${quantity} &bull; ${money(price)} each
                        </div>
                    </div>
                </div>
                <div class="item-price">${money(price * quantity)}</div>
            </div>
        `;
    }).join("");

    const customer = order.customer || {};
    const fullName = customer.fullName || customer.name || "N/A";

    const fullAddress = [
        customer.address,
        customer.apartment,
        [customer.city, customer.state, customer.pincode]
            .filter(Boolean)
            .join(", ")
    ].filter(Boolean).join(", ");

    const pricing = order.pricing || {};
    const subtotal = Number(pricing.subtotal || 0);
    const delivery = Number(pricing.delivery || 0);
    const tax = Number(pricing.tax || 0);
    const total = Number(pricing.total || 0);

    cardContainer.innerHTML = `
        <div class="success-icon-wrap" aria-hidden="true">
            <svg width="36" height="36" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        </div>

        <h1 class="success-title">Order Confirmed!</h1>
        <p class="success-subtitle">
            Your order from ${escapeHTML(orderRestaurant.name)} has been placed successfully.
        </p>

        <div class="order-badge">Order #${escapeHTML(order.orderId)}</div>

        <div class="details-section">
            <div class="details-block">
                <h2 class="block-title">Items Ordered</h2>
                <div class="items-list">${itemsHTML}</div>

                <div class="price-breakdown">
                    <div class="price-row">
                        <span>Subtotal</span>
                        <span>${money(subtotal)}</span>
                    </div>
                    <div class="price-row">
                        <span>Delivery Fee</span>
                        <span>${delivery === 0 ? "Free" : money(delivery)}</span>
                    </div>
                    <div class="price-row">
                        <span>Taxes (10%)</span>
                        <span>${money(tax)}</span>
                    </div>
                    <div class="price-row total-row">
                        <span>Order Total</span>
                        <span class="total-val">${money(total)}</span>
                    </div>
                </div>
            </div>

            <div class="details-block">
                <h2 class="block-title">Delivery Details</h2>
                <div class="customer-info-grid">
                    <div class="info-item">
                        <span class="info-label">Customer Name</span>
                        <span class="info-val">${escapeHTML(fullName)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Phone Number</span>
                        <span class="info-val">${escapeHTML(customer.phone || "N/A")}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Email Address</span>
                        <span class="info-val">${escapeHTML(customer.email || "N/A")}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Delivery Address</span>
                        <span class="info-val">${escapeHTML(fullAddress || "N/A")}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="success-actions">
            <a href="${orderRestaurant.menuUrl}" class="btn-back-menu">
                <span>Back to Menu</span>
                <span>&rarr;</span>
            </a>
            <p class="thank-you-note">
                Thank you for ordering from ${escapeHTML(orderRestaurant.name)}.
            </p>
        </div>
    `;

    console.log("Order confirmation rendered:", order.orderId);
}
