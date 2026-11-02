const cors = require("cors");
const {
    verifyToken,
    requireAdmin
} = require("./middleware/authMiddleware");

const express = require("express");
require("dotenv").config();

const menuRoutes = require("./routes/menuRoutes");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");

const path = require("path");

const app = express();

app.use(cors({
    origin: [
        "http://localhost:8080",
        "http://127.0.0.1:8080"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(function (req, res, next) {
    console.log("Incoming request:", req.method, req.originalUrl);
    next();
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const orderRoutes = require("./routes/orderRoutes");

console.log("Order routes module loaded");

app.use("/api/orders", orderRoutes);

console.log("Order routes mounted at /api/orders");

app.use("/api/auth", authRoutes);

app.use("/api/menu", menuRoutes);

app.get("/api/health", function (req, res) {
    res.json({
        success: true,
        message: "Table & Co. API is running"
    });
});

const PORT = process.env.PORT || 5000;

app.get(
    "/api/admin-test",
    verifyToken,
    requireAdmin,
    function (req, res) {
        res.json({
            success: true,
            message: "Welcome, admin!"
        });
    }
);

async function startServer() {
    await connectDB();

    app.listen(PORT, function () {
        console.log(`Server running on port ${PORT}`);
    });
}

startServer();
