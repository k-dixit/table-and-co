// Burger District product menu data.
const menuItems = [
    // --- Burgers ---
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

// Pizza Palace product menu data.
const pizzaMenuItems = [
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

// Brew Bazaar product menu data.
const coffeeMenuItems = [
    // --- Coffee ---
    {
        id: 24,
        name: "Classic Cappuccino",
        category: "Coffee",
        price: 179,
        description: "Rich espresso topped with silky steamed milk and a layer of foam.",
        image: "../assets/coffee/coffee.png"
    },
    {
        id: 25,
        name: "Café Latte",
        category: "Coffee",
        price: 189,
        description: "Smooth espresso blended with creamy steamed milk.",
        image: "../assets/coffee/coffee.png"
    },
    {
        id: 26,
        name: "Classic Americano",
        category: "Coffee",
        price: 149,
        description: "Bold espresso diluted with hot water for a clean, rich finish.",
        image: "../assets/coffee/coffee.png"
    },
    {
        id: 27,
        name: "Mocha",
        category: "Coffee",
        price: 209,
        description: "Espresso, steamed milk and chocolate blended into a smooth café favorite.",
        image: "../assets/coffee/coffee.png"
    },
    {
        id: 28,
        name: "Caramel Macchiato",
        category: "Coffee",
        price: 229,
        description: "Espresso layered with steamed milk and caramel drizzle.",
        image: "../assets/coffee/coffee.png"
    },
    {
        id: 29,
        name: "Spanish Latte",
        category: "Coffee",
        price: 219,
        description: "Bold espresso balanced with creamy sweetened milk.",
        image: "../assets/coffee/coffee.png"
    },
    {
        id: 30,
        name: "Hazelnut Latte",
        category: "Coffee",
        price: 219,
        description: "Smooth espresso and steamed milk infused with roasted hazelnut flavor.",
        image: "../assets/coffee/coffee.png"
    },
    {
        id: 31,
        name: "Cold Coffee",
        category: "Coffee",
        price: 199,
        description: "Chilled blended coffee with creamy milk and a rich coffee finish.",
        image: "../assets/coffee/coffee.png"
    },

    // --- Tea ---
    {
        id: 32,
        name: "Classic Masala Chai",
        category: "Tea",
        price: 99,
        description: "Traditional Indian tea brewed with milk and aromatic spices.",
        image: "../assets/coffee/coffee.png"
    },
    {
        id: 33,
        name: "Ginger Honey Tea",
        category: "Tea",
        price: 119,
        description: "Warm black tea infused with fresh ginger and honey.",
        image: "../assets/coffee/coffee.png"
    },
    {
        id: 34,
        name: "Lemon Iced Tea",
        category: "Tea",
        price: 129,
        description: "Refreshing chilled tea with a bright citrus finish.",
        image: "../assets/coffee/coffee.png"
    },
    {
        id: 35,
        name: "Peach Iced Tea",
        category: "Tea",
        price: 139,
        description: "Chilled black tea infused with sweet peach flavor.",
        image: "../assets/coffee/coffee.png"
    },
    {
        id: 36,
        name: "Green Tea",
        category: "Tea",
        price: 109,
        description: "Light and refreshing green tea with a clean finish.",
        image: "../assets/coffee/coffee.png"
    },

    // --- Snacks ---
    {
        id: 37,
        name: "Butter Croissant",
        category: "Snacks",
        price: 149,
        description: "Flaky golden croissant baked with rich buttery layers.",
        image: "../assets/coffee/coffee.png"
    },
    {
        id: 38,
        name: "Chocolate Croissant",
        category: "Snacks",
        price: 179,
        description: "Buttery pastry filled with smooth chocolate.",
        image: "../assets/coffee/coffee.png"
    },
    {
        id: 39,
        name: "Veg Cheese Sandwich",
        category: "Snacks",
        price: 189,
        description: "Toasted sandwich filled with vegetables and melted cheese.",
        image: "../assets/coffee/coffee.png"
    },
    {
        id: 40,
        name: "Chicken Club Sandwich",
        category: "Snacks",
        price: 249,
        description: "Toasted bread layered with chicken, vegetables and creamy dressing.",
        image: "../assets/coffee/coffee.png"
    },
    {
        id: 41,
        name: "Loaded Nachos",
        category: "Snacks",
        price: 199,
        description: "Crispy nachos topped with cheese, jalapeños and fresh salsa.",
        image: "../assets/coffee/coffee.png"
    },

    // --- Desserts ---
    {
        id: 42,
        name: "Chocolate Brownie",
        category: "Desserts",
        price: 159,
        description: "Rich fudgy brownie made with dark chocolate.",
        image: "../assets/coffee/coffee.png"
    },
    {
        id: 43,
        name: "Blueberry Cheesecake",
        category: "Desserts",
        price: 229,
        description: "Creamy cheesecake topped with blueberry compote.",
        image: "../assets/coffee/coffee.png"
    },
    {
        id: 44,
        name: "Tiramisu",
        category: "Desserts",
        price: 219,
        description: "Coffee-soaked layers with mascarpone cream and cocoa.",
        image: "../assets/coffee/coffee.png"
    },
    {
        id: 45,
        name: "Chocolate Lava Cake",
        category: "Desserts",
        price: 189,
        description: "Warm chocolate cake with a molten chocolate center.",
        image: "../assets/coffee/coffee.png"
    },
    {
        id: 46,
        name: "Classic Waffle",
        category: "Desserts",
        price: 179,
        description: "Crispy golden waffle served with a sweet finishing touch.",
        image: "../assets/coffee/coffee.png"
    }
];
