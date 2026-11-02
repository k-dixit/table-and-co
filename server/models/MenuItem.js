
const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    restaurant: {
        type: String,
        required: true,
        enum: ["burger", "pizza", "coffee"]
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

menuItemSchema.index(
    { restaurant: 1, id: 1 },
    { unique: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
