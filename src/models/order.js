const mongoose = require("mongoose");
const { campusbytesDB } = require("../config");

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [{ 
        name: String, 
        quantity: Number, 
        price: Number 
    }],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Processing", "Delivered"], default: "Pending" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = campusbytesDB.model("Order", orderSchema);
