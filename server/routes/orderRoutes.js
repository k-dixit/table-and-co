
const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/Order");
const MenuItem = require("../models/MenuItem");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

const DELIVERY_THRESHOLD = 499;
const DELIVERY_FEE = 40;
const TAX_RATE = 0.10;

// POST /api/orders — Place an order
router.post("/", verifyToken, async (req, res) => {
  try {
    const {
      restaurant,
      customer,
      items
    } = req.body;

    // Validate restaurant
    if (!["burger", "pizza", "coffee"].includes(restaurant)) {
      return res.status(400).json({
        success: false,
        message: "Invalid restaurant."
      });
    }

    // Validate customer details
    const requiredFields = [
      "fullName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "pincode"
    ];

    if (
      !customer ||
      requiredFields.some(
        field =>
          typeof customer[field] !== "string" ||
          !customer[field].trim()
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required customer details."
      });
    }

    if (
      !Array.isArray(items) ||
      items.length === 0 ||
      items.some(
        item =>
          !Number.isInteger(Number(item.productId)) ||
          !Number.isInteger(Number(item.quantity)) ||
          Number(item.quantity) < 1 ||
          Number(item.quantity) > 100
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid order items and quantities."
      });
    }

    // Combine duplicate product IDs
    const quantityMap = new Map();

    for (const item of items) {
      const id = Number(item.productId);
      const quantity =
        (quantityMap.get(id) || 0) + Number(item.quantity);

      if (quantity > 100) {
        return res.status(400).json({
          success: false,
          message: "Maximum quantity per product is 100."
        });
      }

      quantityMap.set(id, quantity);
    }

    const productIds = [...quantityMap.keys()];

    // Fetch authoritative prices and details from MongoDB
    const menuItems = await MenuItem.find({
      restaurant,
      id: { $in: productIds }
    });

    if (menuItems.length !== productIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more products were not found in this restaurant's menu."
      });
    }

    const orderItems = menuItems.map(product => ({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantityMap.get(product.id),
      image: product.image || ""
    }));

    // Calculate totals on the server, not from frontend prices
    const subtotal = Number(
      orderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ).toFixed(2)
    );

    const tax = Number((subtotal * TAX_RATE).toFixed(2));
    const delivery =
      subtotal >= DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    const total = Number((subtotal + tax + delivery).toFixed(2));

    // Get authenticated user's ID from JWT middleware
    const userId = req.user?.userId || req.user?.id || req.user?._id;

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication. Please log in again."
      });
    }

    const orderId = `TC-${Date.now()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const order = await Order.create({
      orderId,
      userId,
      restaurant,
      customer: {
        fullName: customer.fullName.trim(),
        email: customer.email.trim(),
        phone: customer.phone.trim(),
        address: customer.address.trim(),
        city: customer.city.trim(),
        state: customer.state.trim(),
        pincode: customer.pincode.trim()
      },
      items: orderItems,
      pricing: {
        subtotal,
        tax,
        delivery,
        total
      }
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      data: order
    });
  } catch (error) {
    console.error("Place order error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to place order. Please try again."
    });
  }
});

// GET /api/orders/:orderId — Retrieve an order
router.get("/:orderId", verifyToken, async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id || req.user?._id;

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication. Please log in again."
      });
    }

    const order = await Order.findOne({
      orderId: req.params.orderId,
      userId
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found."
      });
    }

    return res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error("Get order error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve order."
    });
  }
});

console.log(
    "Registered order routes:",
    router.stack
        .filter(layer => layer.route)
        .map(layer => ({
            path: layer.route.path,
            methods: Object.keys(layer.route.methods)
        }))
);

module.exports = router;
