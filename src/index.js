const express = require('express');
const path = require("path");
const bcrypt = require("bcrypt");
const { User } = require("./config"); // Ensure correct import for User model
const Order = require("./models/order");
const auth = require("./routes/auth"); 

const app = express();

// Middleware
app.use(express.json());
app.use(auth); 
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
// ✅ Ensure static files are served

app.set('view engine', 'ejs');

// ✅ Route: Serve Login Page
app.get("/", (req, res) => {
    res.render("login");
});

// ✅ Route: Serve Home Page
app.get("/home", (req, res) => {
    res.render("home");
});
app.get("/campusbytes/new1.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "campusbytes", "new1.html"));
});


// ✅ Signup Route
app.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).send("All fields are required!");
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send("User with this email already exists!");
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).send("Password must have uppercase, lowercase, a number, and be at least 6 chars long.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: username,
            email: email,
            password: hashedPassword
        });

        await newUser.save();

        console.log("New user created:", newUser);
        res.redirect("/");

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).send("Internal server error");
    }
});

// ✅ Sign-in Route (Redirects to new1.html)
app.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;

        // ✅ Searching user by email instead of name
        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found");
            return res.status(400).send("User not found");
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Incorrect password");
            return res.status(400).send("Invalid password");
        }

        console.log("✅ Login successful");
        res.redirect("/campusbytes/new1.html"); 

    } catch (error) {
        console.error("Signin error:", error);
        res.status(500).send("Internal Server Error");
    }
});



// ✅ Route: Place an Order
const mongoose = require("mongoose");

app.post("/place-order", async (req, res) => {
    try {
        let { userId, items, totalAmount } = req.body;
        
        const userExists = await User.findById(userId);
if (!userExists) {
    return res.status(400).json({ error: "User not found" });
}
app.get('/user/:id', async (req, res) => {
    try {
        let userId = req.params.id;

        // Validate and convert userId to ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const user = await User.findOne({ _id: new mongoose.Types.ObjectId(userId) });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Order error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


        // ✅ Validate and Convert userId to ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid User ID format" });
        }
        userId = new mongoose.Types.ObjectId(userId); // Convert to ObjectId

        const newOrder = new Order({
            userId,
            items,
            totalAmount,
            status: "Pending" // Default status
        });

        await newOrder.save();

        console.log("✅ Order placed:", newOrder);
        res.status(201).json({ message: "Order placed successfully", order: newOrder });

    } catch (error) {
        console.error("Order error:", error);
        res.status(500).json({ error: "Failed to place order" });
    }
});


// ✅ Route: Fetch Orders
app.get("/order", async (req, res) => {
    try {
        const orders = await Order.find().populate("userId", "name email");
        res.json(orders);
    } catch (error) {
        console.error("Fetch orders error:", error);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});
app.post('/order', async (req, res) => {
    try {
        let { userId, items } = req.body;

        // Validate and convert userId to ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const order = new Order({
            userId: new mongoose.Types.ObjectId(userId),
            items,
            status: "Processing"
        });

        await order.save();
        res.status(201).json(order);
    } catch (error) {
        console.error("Order error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
app.get('/orders/:userId', async (req, res) => {
    try {
        let userId = req.params.userId;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const orders = await Order.find({ userId: new mongoose.Types.ObjectId(userId) });

        res.json(orders);
    } catch (error) {
        console.error("Order error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// ✅ Route: Update Order Status
app.put("/update-order/:id", async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;

        if (!["Pending", "Processing", "Delivered"].includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ error: "Order not found" });
        }

        console.log("✅ Order updated:", updatedOrder);
        res.json(updatedOrder);

    } catch (error) {
        console.error("Update order error:", error);
        res.status(500).json({ error: "Failed to update order" });
    }
});
let isUpdating = false;
const updateOrderStatus = async () => {
    if (isUpdating) return;
    isUpdating = true;
    try {
        const pendingOrders = await Order.find({ status: "Pending" });
        for (let order of pendingOrders) {
            setTimeout(async () => {
                await Order.findByIdAndUpdate(order._id, { status: "Processing" });
                console.log(`✅ Order ${order._id} moved to Processing`);
            }, 5000);
        }
    } catch (error) {
        console.error("Error updating order status:", error);
    }
};

setInterval(updateOrderStatus, 15000); // Check every 10 seconds


// ✅ Start Server
const port = 5000;
app.listen(port, () => {
    console.log(`🚀 Server running on port: ${port}`);
});
