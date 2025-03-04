const mongoose = require("mongoose");
const { loginTutDB } = require("../config");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Use loginTutDB for users
const User = loginTutDB.models.User || loginTutDB.model("User", userSchema);

module.exports = User;
