const mongoose = require("mongoose")

const itemSchema = new mongoose.Schema({
    parent: { type: mongoose.ObjectId, ref: "Collection", required: true },
    name: { type: String, required: true },
    tags: [{ type: String, required: true }],
    additionalFields: [
        {
            type: { type: String, required: true },
            name: { type: String, required: true },
            value: { type: String, required: true },
        },
    ],
    comments: [
        {
            author: { type: String, required: true },
            comment: { type: String, required: true },
            time: { type: Date, required: true },
        },
    ],
    likes: [{ type: String }],
})

itemSchema.index({ "$**": "text" })

const Item = mongoose.model("Item", itemSchema)

module.exports = Item
