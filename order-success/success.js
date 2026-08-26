// Renders order confirmation details from localStorage.

const LAST_ORDER_STORAGE_KEY = "tableCoLastOrder";

document.addEventListener('DOMContentLoaded', () => {
    renderSuccessPage();
});

// Reads the last order details from localStorage and renders the confirmation summary.
function renderSuccessPage() {
    const cardContainer = document.getElementById('success-card');
    if (!cardContainer) return;

    let order = null;
    try {
        const storedData = localStorage.getItem(LAST_ORDER_STORAGE_KEY);
        if (storedData) {
            order = JSON.parse(storedData);
        }
    } catch (error) {
        console.error('[Success Page] Error parsing tableCoLastOrder from localStorage:', error);
        order = null;
    }

    if (!order || !order.orderId || !order.items || !Array.isArray(order.items) || order.items.length === 0) {
        cardContainer.innerHTML = `
            <div class="fallback-state">
                <h1 class="fallback-title">No recent order found.</h1>
                <p class="success-subtitle">It looks like you haven't placed an order recently.</p>
                <div class="success-actions">
                    <a href="../menu/menu.html" class="btn-back-menu">
                        <span>Back to Menu</span>
                        <span>&rarr;</span>
                    </a>
                </div>
            </div>
        `;
        console.log('[Success Page] Rendered fallback state (no recent order).');
        return;
    }

    const itemsHTML = order.items.map(orderItem => {
        const product = (typeof menuItems !== 'undefined' && Array.isArray(menuItems))
            ? menuItems.find(p => p.id === orderItem.productId)
            : null;

        const name = product ? product.name : `Product #${orderItem.productId}`;
        const price = product ? product.price : (orderItem.price || 0);
        const image = product ? product.image : '../assets/burger.png';
        const lineTotal = price * orderItem.quantity;

        return `
            <div class="item-row">
                <div class="item-left">
                    <img src="${image}" alt="${name}" class="item-img" />
                    <div>
                        <div class="item-name">${name}</div>
                        <div class="item-qty">Qty ${orderItem.quantity} &bull; ₹${price} each</div>
                    </div>
                </div>
                <div class="item-price">₹${lineTotal}</div>
            </div>
        `;
    }).join('');

    const cust = order.customer || {};
    const fullAddress = [
        cust.address,
        cust.apartment,
        `${cust.city || ''}, ${cust.state || ''} ${cust.pincode || ''}`
    ].filter(Boolean).join(', ');

    const pricing = order.pricing || {};
    const subtotal = pricing.subtotal || 0;
    const deliveryFee = pricing.delivery === 0 ? "Free" : `₹${pricing.delivery || 0}`;
    const tax = pricing.tax || 0;
    const total = pricing.total || 0;

    cardContainer.innerHTML = `
        <!-- Checkmark Graphic -->
        <div class="success-icon-wrap" aria-hidden="true">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        </div>

        <h1 class="success-title">Order Confirmed!</h1>
        <p class="success-subtitle">Your order has been placed successfully.</p>

        <!-- Order Badge -->
        <div class="order-badge">Order #${order.orderId}</div>

        <div class="details-section">

            <!-- Items & Pricing Block -->
            <div class="details-block">
                <h2 class="block-title">Items Ordered</h2>
                <div class="items-list">
                    ${itemsHTML}
                </div>

                <div class="price-breakdown">
                    <div class="price-row">
                        <span>Subtotal</span>
                        <span>₹${subtotal}</span>
                    </div>
                    <div class="price-row">
                        <span>Delivery Fee</span>
                        <span>${deliveryFee}</span>
                    </div>
                    <div class="price-row">
                        <span>Taxes (10%)</span>
                        <span>₹${tax}</span>
                    </div>
                    <div class="price-row total-row">
                        <span>Total Paid</span>
                        <span class="total-val">₹${total}</span>
                    </div>
                </div>
            </div>

            <!-- Delivery Details Block -->
            <div class="details-block">
                <h2 class="block-title">Delivery Details</h2>
                <div class="customer-info-grid">
                    <div class="info-item">
                        <span class="info-label">Customer Name</span>
                        <span class="info-val">${cust.name || 'N/A'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Phone Number</span>
                        <span class="info-val">${cust.phone || 'N/A'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Email Address</span>
                        <span class="info-val">${cust.email || 'N/A'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Delivery Address</span>
                        <span class="info-val">${fullAddress || 'N/A'}</span>
                    </div>
                </div>
            </div>

        </div>

        <!-- Action & Thank You -->
        <div class="success-actions">
            <a href="../menu/menu.html" class="btn-back-menu">
                <span>Back to Menu</span>
                <span>&rarr;</span>
            </a>
            <p class="thank-you-note">Thank you for ordering from Burger District.</p>
        </div>
    `;

    console.log(`[Success Page] Successfully rendered order confirmation for #${order.orderId}.`);
}
