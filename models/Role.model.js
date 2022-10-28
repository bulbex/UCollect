const mongoose = require("mongoose")

const roleSchema = new mongoose.Schema({
    value: { type: String, unique: true, default: "USER" },
})

const Role = mongoose.model("Role", roleSchema)

module.exports = Role