
const mongoose = require("mongoose");
require("dotenv").config();

const MenuItem = require("../models/MenuItem");

const burgerItems = [
    {
        id: 1,
        name: "Classic Smash Burger",
        category: "Burgers",
        price: 249,
        description: "Smashed beef patty with cheese, pickles, onions & signature sauce.",
        image: "../assets/burger/classic-smash-burger.jpg"
    },
    {
        id: 2,
        name: "Spicy Jalapeño Burger",
        category: "Burgers",
        price: 269,
        description: "Spicy jalapeños, pepper jack cheese, lettuce & chipotle mayo.",
        image: "../assets/burger/spicy-jalapeno-burger.jpg"
    },
    {
        id: 3,
        name: "BBQ Bacon Burger",
        category: "Burgers",
        price: 289,
        description: "Beef patty, crispy bacon, cheddar cheese & smoky BBQ sauce.",
        image: "../assets/burger/bbq-bacon-burger.jpg"
    },
    {
        id: 4,
        name: "Mushroom Melt Burger",
        category: "Burgers",
        price: 269,
        description: "Sautéed mushrooms, Swiss cheese, lettuce & garlic aioli.",
        image: "../assets/burger/mushroom-melt-burger.jpg"
    },
    {
        id: 5,
        name: "Crispy Chicken Burger",
        category: "Burgers",
        price: 249,
        description: "Crispy chicken fillet, lettuce, tomato & spicy mayo.",
        image: "../assets/burger/crispy-chicken-burger.jpg"
    },
    {
        id: 6,
        name: "Double Decker Burger",
        category: "Burgers",
        price: 329,
        description: "Double beef patty, double cheese, lettuce, pickles & burger sauce.",
        image: "../assets/burger/double-decker-burger.jpg"
    },
    {
        id: 7,
        name: "Paneer Tikka Burger",
        category: "Burgers",
        price: 249,
        description: "Grilled paneer tikka, onion, lettuce & mint mayo.",
        image: "../assets/burger/paneer-tikka-burger.jpg"
    },
    {
        id: 8,
        name: "Veg Supreme Burger",
        category: "Burgers",
        price: 229,
        description: "Veg patty, lettuce, tomato, onions & special sauce.",
        image: "../assets/burger/veg-supreme-burger.jpg"
    },

    // --- Fries ---
    {
        id: 9,
        name: "Classic Salted Fries",
        category: "Fries",
        price: 129,
        description: "Crispy golden fries seasoned with our signature salt blend.",
        image: "../assets/burger/classic-salted-fries.jpg"
    },
    {
        id: 10,
        name: "Peri Peri Fries",
        category: "Fries",
        price: 149,
        description: "Crispy fries tossed in our bold and spicy peri peri seasoning.",
        image: "../assets/burger/peri-peri-fries.jpg"
    },
    {
        id: 11,
        name: "Cheesy Loaded Fries",
        category: "Fries",
        price: 179,
        description: "Golden fries loaded with melted cheese and our signature sauce.",
        image: "../assets/burger/cheesy-loaded-fries.jpg"
    },
    {
        id: 12,
        name: "BBQ Chicken Fries",
        category: "Fries",
        price: 199,
        description: "Crispy fries topped with smoky BBQ chicken and melted cheese.",
        image: "../assets/burger/bbq-chicken-fries.jpg"
    },
    {
        id: 13,
        name: "Garlic Parmesan Fries",
        category: "Fries",
        price: 169,
        description: "Crispy fries tossed with garlic, parmesan and fresh herbs.",
        image: "../assets/burger/garlic-parmesan-fries.jpg"
    },

    // --- Drinks ---
    {
        id: 14,
        name: "Classic Cola",
        category: "Drinks",
        price: 89,
        description: "Chilled classic cola served over ice.",
        image: "../assets/burger/classic-cola.png"
    },
    {
        id: 15,
        name: "Lemon Iced Tea",
        category: "Drinks",
        price: 109,
        description: "Refreshing iced tea with a bright lemon finish.",
        image: "../assets/burger/lemon-iced-tea.png"
    },
    {
        id: 16,
        name: "Fresh Lime Soda",
        category: "Drinks",
        price: 119,
        description: "Sparkling lime soda with a refreshing citrus kick.",
        image: "../assets/burger/fresh-lime-soda.png"
    },
    {
        id: 17,
        name: "Mango Cooler",
        category: "Drinks",
        price: 129,
        description: "A chilled tropical mango drink with a refreshing finish.",
        image: "../assets/burger/mango-cooler.png"
    },
    {
        id: 18,
        name: "Berry Fizz",
        category: "Drinks",
        price: 139,
        description: "A sparkling berry drink with a sweet and tangy finish.",
        image: "../assets/burger/berry-fizz.png"
    },

    // --- Shakes ---
    {
        id: 19,
        name: "Classic Vanilla Shake",
        category: "Shakes",
        price: 159,
        description: "Creamy vanilla shake topped with a light whipped cream finish.",
        image: "../assets/burger/classic-vanilla-shake.png"
    },
    {
        id: 20,
        name: "Chocolate Fudge Shake",
        category: "Shakes",
        price: 179,
        description: "Rich chocolate shake blended with smooth chocolate fudge.",
        image: "../assets/burger/chocolate-fudge-shake.png"
    },
    {
        id: 21,
        name: "Strawberry Cream Shake",
        category: "Shakes",
        price: 179,
        description: "Creamy strawberry shake made with real strawberry flavor.",
        image: "../assets/burger/strawberry-cream-shake.png"
    },
    {
        id: 22,
        name: "Oreo Crunch Shake",
        category: "Shakes",
        price: 199,
        description: "Creamy vanilla shake blended with crunchy chocolate cookie pieces.",
        image: "../assets/burger/oreo-crunch-shake.png"
    },
    {
        id: 23,
        name: "Salted Caramel Shake",
        category: "Shakes",
        price: 199,
        description: "Rich caramel shake with a smooth salted caramel finish.",
        image: "../assets/burger/salted-caramel-shake.png"
    }
    
];

const pizzaItems = [
    // --- Pizzas ---
    {
        id: 1,
        name: "Margherita",
        category: "Pizzas",
        price: 249,
        description: "Classic tomato sauce, mozzarella and fresh basil.",
        image: "../assets/pizza/pizza.png"
    },
    {
        id: 2,
        name: "Farmhouse Pizza",
        category: "Pizzas",
        price: 299,
        description: "Onions, capsicum, mushrooms, tomatoes and mozzarella.",
        image: "../assets/pizza/pizza.png"
    },
    {
        id: 3,
        name: "Spicy Paneer Pizza",
        category: "Pizzas",
        price: 329,
        description: "Spiced paneer, onions, jalapeños and mozzarella.",
        image: "../assets/pizza/pizza.png"
    },
    {
        id: 4,
        name: "BBQ Chicken Pizza",
        category: "Pizzas",
        price: 349,
        description: "BBQ chicken, onions, peppers and smoky BBQ sauce.",
        image: "../assets/pizza/pizza.png"
    },
    {
        id: 5,
        name: "Four Cheese Pizza",
        category: "Pizzas",
        price: 379,
        description: "A rich blend of mozzarella, cheddar, parmesan and cheese sauce.",
        image: "../assets/pizza/pizza.png"
    },
    {
        id: 6,
        name: "Mexican Fiesta Pizza",
        category: "Pizzas",
        price: 329,
        description: "Jalapeños, onions, capsicum, corn and Mexican seasoning.",
        image: "../assets/pizza/pizza.png"
    },
    {
        id: 7,
        name: "Truffle Mushroom Pizza",
        category: "Pizzas",
        price: 399,
        description: "Mushrooms, mozzarella, herbs and a subtle truffle finish.",
        image: "../assets/pizza/pizza.png"
    },
    {
        id: 8,
        name: "Pepperoni Pizza",
        category: "Pizzas",
        price: 379,
        description: "Classic pepperoni, tomato sauce and melted mozzarella.",
        image: "../assets/pizza/pizza.png"
    },

    // --- Sides ---
    {
        id: 9,
        name: "Classic Garlic Bread",
        category: "Sides",
        price: 129,
        description: "Crispy baked garlic bread with garlic butter and herbs.",
        image: "../assets/pizza/pizza.png"
    },
    {
        id: 10,
        name: "Cheese Garlic Bread",
        category: "Sides",
        price: 169,
        description: "Freshly baked garlic bread topped with melted mozzarella cheese.",
        image: "../assets/pizza/pizza.png"
    },
    {
        id: 11,
        name: "Loaded Potato Wedges",
        category: "Sides",
        price: 179,
        description: "Crispy potato wedges topped with melted cheese and herbs.",
        image: "../assets/pizza/pizza.png"
    },
    {
        id: 12,
        name: "Mozzarella Sticks",
        category: "Sides",
        price: 199,
        description: "Golden crispy mozzarella sticks served with dipping sauce.",
        image: "../assets/pizza/pizza.png"
    },
    {
        id: 13,
        name: "Cheesy Bread Bites",
        category: "Sides",
        price: 159,
        description: "Bite-sized cheesy bread rolls baked to perfection.",
        image: "../assets/pizza/pizza.png"
    },

    // --- Drinks ---
    {
        id: 14,
        name: "Classic Cola",
        category: "Drinks",
        price: 89,
        description: "Chilled classic cola served over ice.",
        image: "../assets/coffee.png"
    },
    {
        id: 15,
        name: "Lemon Iced Tea",
        category: "Drinks",
        price: 109,
        description: "Refreshing iced tea with a bright lemon finish.",
        image: "../assets/coffee.png"
    },
    {
        id: 16,
        name: "Fresh Lime Soda",
        category: "Drinks",
        price: 119,
        description: "Sparkling lime soda with a refreshing citrus kick.",
        image: "../assets/coffee.png"
    },
    {
        id: 17,
        name: "Mango Cooler",
        category: "Drinks",
        price: 129,
        description: "A chilled tropical mango drink with a refreshing finish.",
        image: "../assets/coffee.png"
    },
    {
        id: 18,
        name: "Berry Fizz",
        category: "Drinks",
        price: 139,
        description: "A sparkling berry drink with a sweet and tangy finish.",
        image: "../assets/coffee.png"
    },

    // --- Desserts ---
    {
        id: 19,
        name: "Chocolate Lava Cake",
        category: "Desserts",
        price: 179,
        description: "Warm chocolate cake filled with molten chocolate lava.",
        image: "../assets/coffee.png"
    },
    {
        id: 20,
        name: "Classic Brownie",
        category: "Desserts",
        price: 149,
        description: "Fudgy chocolate brownie baked with real cocoa.",
        image: "../assets/coffee.png"
    },
    {
        id: 21,
        name: "Tiramisu",
        category: "Desserts",
        price: 199,
        description: "Classic Italian dessert made with coffee-soaked layers and mascarpone.",
        image: "../assets/coffee.png"
    },
    {
        id: 22,
        name: "New York Cheesecake",
        category: "Desserts",
        price: 219,
        description: "Rich and creamy New York style cheesecake with a Graham crust.",
        image: "../assets/coffee.png"
    },
    {
        id: 23,
        name: "Chocolate Mousse",
        category: "Desserts",
        price: 169,
        description: "Smooth and velvety light chocolate mousse.",
        image: "../assets/coffee.png"
    }
];

const coffeeItems = [
    // Add the 23 Brew Bazaar items here.
    // Add the 23 Brew Bazaar items here.

// --- Espresso Beverages ---
{
    id: 1,
    name: "Espresso Shot",
    category: "Espresso Beverages",
    price: 150,
    description: "A rich, concentrated shot of our signature espresso.",
    image: "../assets/coffee.png"
},
{
    id: 2,
    name: "Americano",
    category: "Espresso Beverages",
    price: 180,
    description: "Espresso shots topped with hot water for a smooth, bold drink.",
    image: "../assets/coffee.png"
},
{
    id: 3,
    name: "Latte",
    category: "Espresso Beverages",
    price: 220,
    description: "Rich espresso with steamed milk and a light layer of foam.",
    image: "../assets/coffee.png"
},
{
    id: 4,
    name: "Cappuccino",
    category: "Espresso Beverages",
    price: 210,
    description: "Espresso with equal parts steamed milk and foam for a rich texture.",
    image: "../assets/coffee.png"
},
{
    id: 5,
    name: "Flat White",
    category: "Espresso Beverages",
    price: 230,
    description: "Strong espresso with velvety steamed milk and a smooth finish.",
    image: "../assets/coffee.png"
},
{
    id: 6,
    name: "Mocha",
    category: "Espresso Beverages",
    price: 250,
    description: "Rich chocolate combined with espresso and steamed milk, topped with whipped cream.",
    image: "../assets/coffee.png"
},

// --- Brewed Coffee ---
{
    id: 7,
    name: "Filter Coffee",
    category: "Brewed Coffee",
    price: 160,
    description: "Classic brewed coffee with a smooth and balanced flavor profile.",
    image: "../assets/coffee.png"
},
{
    id: 8,
    name: "French Press",
    category: "Brewed Coffee",
    price: 190,
    description: "Slow-steeped coffee with a rich body and robust flavor.",
    image: "../assets/coffee.png"
},
{
    id: 9,
    name: "Pour Over",
    category: "Brewed Coffee",
    price: 200,
    description: "Carefully crafted pour-over for a clean, nuanced brew.",
    image: "../assets/coffee.png"
},
{
    id: 10,
    name: "Cold Brew",
    category: "Brewed Coffee",
    price: 220,
    description: "Slow-steeped for 18 hours, resulting in a smooth, low-acidity coffee.",
    image: "../assets/coffee.png"
},

// --- Specialty Drinks ---
{
    id: 11,
    name: "Vanilla Latte",
    category: "Specialty Drinks",
    price: 250,
    description: "Our classic latte infused with rich vanilla syrup.",
    image: "../assets/coffee.png"
},
{
    id: 12,
    name: "Caramel Macchiato",
    category: "Specialty Drinks",
    price: 260,
    description: "Steamed milk and vanilla syrup topped with espresso and a caramel drizzle.",
    image: "../assets/coffee.png"
},
{
    id: 13,
    name: "Hazelnut Latte",
    category: "Specialty Drinks",
    price: 250,
    description: "A delightful blend of hazelnut syrup with smooth latte.",
    image: "../assets/coffee.png"
},
{
    id: 14,
    name: "Pumpkin Spice Latte",
    category: "Specialty Drinks",
    price: 280,
    description: "Seasonal favorite with pumpkin spice, espresso and creamy milk.",
    image: "../assets/coffee.png"
},
{
    id: 15,
    name: "White Chocolate Mocha",
    category: "Specialty Drinks",
    price: 270,
    description: "Rich white chocolate meets bold espresso for a decadent treat.",
    image: "../assets/coffee.png"
},

// --- Chai & Tea ---
{
    id: 16,
    name: "Masala Chai",
    category: "Chai & Tea",
    price: 180,
    description: "Spiced Indian tea brewed with aromatic herbs and spices.",
    image: "../assets/coffee.png"
},
{
    id: 17,
    name: "Green Tea",
    category: "Chai & Tea",
    price: 150,
    description: "Light and refreshing green tea with subtle earthy notes.",
    image: "../assets/coffee.png"
},
{
    id: 18,
    name: "English Breakfast Tea",
    category: "Chai & Tea",
    price: 150,
    description: "A classic bold black tea blend, perfect for starting your day.",
    image: "../assets/coffee.png"
},
{
    id: 19,
    name: "Peppermint Tea",
    category: "Chai & Tea",
    price: 160,
    description: "Cooling and refreshing peppermint tea for a soothing experience.",
    image: "../assets/coffee.png"
},
{
    id: 20,
    name: "Chamomile Tea",
    category: "Chai & Tea",
    price: 160,
    description: "Calming chamomile blend perfect for relaxation.",
    image: "../assets/coffee.png"
},

// --- Frappes ---
{
    id: 21,
    name: "Coffee Frappe",
    category: "Frappes",
    price: 280,
    description: "A refreshing coffee-based blended drink with ice and whipped cream.",
    image: "../assets/coffee.png"
},
{
    id: 22,
    name: "Chocolate Frappe",
    category: "Frappes",
    price: 290,
    description: "Rich chocolate blended with ice and topped with whipped cream.",
    image: "../assets/coffee.png"
},
{
    id: 23,
    name: "Vanilla Bean Frappe",
    category: "Frappes",
    price: 270,
    description: "Creamy vanilla bean frappe with a smooth, refreshing texture.",
    image: "../assets/coffee.png"
}

];

async function seedMenu() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const allItems = [
            ...burgerItems.map(item => ({
                ...item,
                restaurant: "burger"
            })),
            ...pizzaItems.map(item => ({
                ...item,
                restaurant: "pizza"
            })),
            ...coffeeItems.map(item => ({
                ...item,
                restaurant: "coffee"
            }))
        ];

        for (const item of allItems) {
            await MenuItem.updateOne(
                {
                    restaurant: item.restaurant,
                    id: item.id
                },
                { $set: item },
                { upsert: true }
            );
        }

        console.log(`Seeded ${allItems.length} menu items.`);
    } catch (error) {
        console.error("Menu seeding failed:", error.message);
    } finally {
        await mongoose.disconnect();
    }
}

seedMenu();
