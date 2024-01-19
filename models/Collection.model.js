const mongoose = require("mongoose")

const collectionSchema = new mongoose.Schema({
    owner: { type: mongoose.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, unique: true },
    topic: { type: String, required: true },
    description: { type: String, required: true },
    photo: { type: String },
    itemFields: [
        {
            type: { type: String, required: true },
            name: { type: String, required: true },
        },
    ],
    creationTime: { type: Date, required: true },
    items: [{ type: mongoose.ObjectId, ref: "Item" }],
})

collectionSchema.index({ "name": "text" })

const Collection = mongoose.model("Collection", collectionSchema)

module.exports = Collection
