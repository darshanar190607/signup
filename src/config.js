const mongoose = require("mongoose");

// Connection URI
const LOGIN_TUT_URI = "mongodb://127.0.0.1:27017/login-tut";
const CAMPUSBYTES_URI = "mongodb://127.0.0.1:27017/campusbytes";

// Connect to login-tut (for users)
const loginTutDB = mongoose.createConnection(LOGIN_TUT_URI);

loginTutDB.on("connected", () => console.log("✅ Connected to MongoDB (login-tut)"));
loginTutDB.on("error", (err) => console.error("❌ Database connection error (login-tut):", err));

// Define User Schema
const LoginSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Create User Model
const User = loginTutDB.model("User", LoginSchema);

// Connect to campusbytesDB (for orders, food items, etc.)
const campusbytesDB = mongoose.createConnection(CAMPUSBYTES_URI);

campusbytesDB.on("connected", () => console.log("✅ Connected to MongoDB (campusbytes)"));
campusbytesDB.on("error", (err) => console.error("❌ MongoDB connection error (campusbytes):", err));

// Export databases and models
module.exports = { loginTutDB, campusbytesDB, User };