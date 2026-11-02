
const upload = require("../middleware/uploadMiddleware");
const express = require("express");
const MenuItem = require("../models/MenuItem");
const { verifyToken, requireAdmin } =
    require("../middleware/authMiddleware");

const router = express.Router();

// Get all menu items, optionally filtered by restaurant
router.get("/", async function (req, res) {
    try {
        const filter = {};

        if (req.query.restaurant) {
            filter.restaurant = req.query.restaurant;
        }

        const items = await MenuItem.find(filter);

        res.json({
            success: true,
            count: items.length,
            data: items
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch menu items"
        });
    }
});

// Get one menu item by restaurant and product ID
router.get("/:restaurant/:id", async function (req, res) {
    try {
        const item = await MenuItem.findOne({
            restaurant: req.params.restaurant,
            id: Number(req.params.id)
        });

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Menu item not found"
            });
        }

        res.json({
            success: true,
            data: item
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch menu item"
        });
    }
});


/* Create a menu item — admin only */
router.post("/", verifyToken, requireAdmin, async function (req, res) {
    try {
        const { id, restaurant, name, category, price, description, image } = req.body;

        if (
            id === undefined ||
            !restaurant ||
            !name ||
            !category ||
            price === undefined ||
            !description ||
            !image
        ) {
            return res.status(400).json({
                success: false,
                message: "All menu item fields are required"
            });
        }

        const item = await MenuItem.create({
            id,
            restaurant,
            name,
            category,
            price,
            description,
            image
        });

        res.status(201).json({
            success: true,
            message: "Menu item created",
            data: item
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "This product ID already exists for this restaurant"
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to create menu item"
        });
    }
});

/* Update a menu item — admin only */
router.put("/:restaurant/:id", verifyToken, requireAdmin, async function (req, res) {
    try {
        const item = await MenuItem.findOneAndUpdate(
            {
                restaurant: req.params.restaurant,
                id: Number(req.params.id)
            },
            { $set: req.body },
            {
                new: true,
                runValidators: true
            }
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Menu item not found"
            });
        }

        res.json({
            success: true,
            message: "Menu item updated",
            data: item
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update menu item"
        });
    }
});

/* Delete a menu item — admin only */
router.delete("/:restaurant/:id", verifyToken, requireAdmin, async function (req, res) {
    try {
        const item = await MenuItem.findOneAndDelete({
            restaurant: req.params.restaurant,
            id: Number(req.params.id)
        });

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Menu item not found"
            });
        }

        res.json({
            success: true,
            message: "Menu item deleted"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete menu item"
        });
    }
});


router.post(
    "/:restaurant/:id/image",
    verifyToken,
    requireAdmin,
    upload.single("image"),
    async function (req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "Please select an image"
                });
            }

            const imagePath = "/uploads/" + req.file.filename;

            const item = await MenuItem.findOneAndUpdate(
                {
                    restaurant: req.params.restaurant,
                    id: Number(req.params.id)
                },
                { $set: { image: imagePath } },
                { new: true }
            );

            if (!item) {
                return res.status(404).json({
                    success: false,
                    message: "Menu item not found"
                });
            }

            res.json({
                success: true,
                message: "Menu image uploaded successfully",
                image: imagePath,
                data: item
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Image upload failed"
            });
        }
    }
);


module.exports = router;
