const mongoose = require("mongoose");
const express = require("express");
const Order = require("../models/order");

const router = express.Router();

// Get all orders (Admin)
router.get("/orders", async (req, res) => {
    try {
        const orders = await Order.find().populate("userId", "name email");
        res.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Error fetching orders" });
    }
});

// Get orders for a specific user
router.get("/my-orders/:userId", async (req, res) => {
    try {
        const orders = await Order.find({ userId: mongoose.Types.ObjectId(req.params.userId) });

    } catch (error) {
        console.error("Error fetching user's orders:", error);
        res.status(500).json({ message: "Error fetching orders" });
    }
});

// Place an order
router.post("/place-order", async (req, res) => {
    try {
        const { items, totalAmount } = req.body;
const userId = mongoose.Types.ObjectId(req.body.userId);

        if (!userId || !items || totalAmount == null) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const newOrder = new Order({ userId, items, totalAmount, status: "Pending" });
        await newOrder.save();
        res.status(201).json({ message: "Order placed successfully", order: newOrder });
    } catch (error) {
        console.error("Order placement error:", error);
        res.status(500).json({ message: "Error placing order" });
    }
});

// Update order status
router.put("/update-order/:id", async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ["Pending", "Processing", "Delivered"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.json({ message: "Order status updated", order: updatedOrder });
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ message: "Error updating order" });
    }
});

// Function to delay execution
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Automatically update order status from Pending → Processing → Delivered
const updateOrderStatus = async () => {
    try {
        const pendingOrders = await Order.find({ status: "Pending" });
        for (let order of pendingOrders) {
            setTimeout(async () => {
                await Order.findByIdAndUpdate(order._id, { status: "Processing" });
                console.log(`✅ Order ${order._id} moved to Processing`);

                setTimeout(async () => {
                    await Order.findByIdAndUpdate(order._id, { status: "Delivered" });
                    console.log(`✅ Order ${order._id} delivered`);
                }, 5000);
            }, 5000);
        }
    } catch (error) {
        console.error("Error updating order status:", error);
    }
};

// Run automatic status updates every 15 seconds to avoid overlapping updates
setInterval(updateOrderStatus, 15000);

module.exports = router;
