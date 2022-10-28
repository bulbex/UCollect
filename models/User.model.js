const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: mongoose.ObjectId, ref: "Role", required: true },
    status: { type: String, required: true },
    collections: [{ type: mongoose.ObjectId, ref: "Collection" }]
})

const User = mongoose.model("User", userSchema)

module.exports = User
