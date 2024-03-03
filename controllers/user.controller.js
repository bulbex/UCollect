const User = require("../models/User.model")
const Collection = require("../models/Collection.model")
const Item = require("../models/Item.model")
const Role = require("../models/Role.model")
const fs = require("fs")
const { validationResult } = require("express-validator")

// Gets user data
exports.getUserData = async (req, res) => {
    try {
        let user = await User.findOne({ _id: req.user._id }).populate("role")
        if (!user) {
            return res.status(404).send({ message: "User not found!" })
        }

        let responseData = {
            _id: user._id,
            username: user.username,
            role: user.role.value,
        }

        res.status(200).send(responseData)
    } catch (error) {
        res.status(500).send({ message: "User Data Error" })
    }
}

// Gets user page (user collections)
exports.getUserPage = async (req, res) => {
    try {
        let user = await User.findOne({ username: req.params.username }).populate(
            "collections"
        )

        if (`${user._id}` === req.user._id || req.user.role === "ADMIN") {
            return res.status(200).send(user.collections)
        }

        res.status(403).send({ message: "Forbidden!" })
    } catch (error) {
        res.status(500).send({ message: "Get collections error!" })
    }
}

// Creates collection
exports.createCollection = async (req, res) => {
    try {
        
        if (!validationResult(req).isEmpty()) {
            return res.status(400).send({ message: "Incorrect data provided!" })
        }
        
        let owner = await User.findOne({ username: req.params.username }).select(
            "username collections"
        )

        
        if (`${owner._id}` === req.user._id || req.user.role === "ADMIN") {

            let photoPath = ""
            if (req.file) {
                photoPath = req.file.path
            }

            const collection = new Collection({
                owner: owner,
                name: req.body.name,
                topic: req.body.topic,
                description: req.body.description,
                photo: photoPath,
                itemFields: JSON.parse(req.body.itemFields),
                creationTime: new Date(),
            })

            owner.collections.push(collection)
            await collection.save()
            await owner.save()

            return res.status(201).send({ message: "Created successfully!" })
        }
        res.status(403).send({ message: "Forbidden!" })
    } catch (error) {
        res.status(500).send({ message: "Create collection error" })
    }
}

// Edits collection
exports.editCollection = async (req, res) => {
    try {

        if (!validationResult(req).isEmpty()) {
            return res.status(400).send({ message: "Incorrect data provided!" })
        }

        let collection = await Collection.findOne({ _id: req.body._id })
        
        if (`${collection.owner}` === req.user._id || req.user.role === "ADMIN") {
            // Replace current photo and delete old photo
            if (req.file) {
                collection.photo ? fs.unlinkSync(collection.photo) : null
                collection.photo = req.file.path
            }

            // Delete current collection photo without replacing
            if (req.body.collectionPhoto === 'clean') {
                collection.photo ? fs.unlinkSync(collection.photo) : null
                collection.photo = ""
            }

            await collection.updateOne({
                name: req.body.name,
                topic: req.body.topic,
                description: req.body.description,
            })
            await collection.save()

            return res.status(201).send({ message: "Edited successfully!" })
        }

        req.file ? fs.unlinkSync(req.file.path) : null
        res.status(403).send({
            message: "Only collection owner or admin can modify collections!",
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Edit collection error!" })
    }
}


// Deletes collection
exports.deleteCollection = async (req, res) => {
    try {
        let collection = await Collection.findOne({ _id: req.params.id })

        if (`${collection.owner}` === req.user._id || req.user.role === "ADMIN") {
            let user = await User.findOne({ _id: collection.owner })

            collection.photo ? fs.unlinkSync(collection.photo) : null

            let index = user.collections.indexOf(collection._id)

            user.collections.splice(index, 1)

            await user.save()
            await Item.find({ _id: collection.items }).deleteMany()
            await collection.deleteOne()

            return res.status(200).send({ message: "Deleted successfully!" })
        }

        res.status(403).send({
            message: "Only collection owner or admin can modify collections!",
        })
    } catch (error) {
        res.status(500).send({ message: "Delete collection error!" })
    }
}

// Adds item
exports.addItem = async (req, res) => {
    try {

        if (!validationResult(req).isEmpty()) {
            return res.status(400).send({ message: "Incorrect data provided!" })
        }

        const parent = await Collection.findOne({ _id: req.body.parent }).populate("owner")
        if (`${parent.owner._id}` === req.user._id || req.user.role === "ADMIN") {
            const item = new Item({
                parent: parent,
                name: req.body.name,
                tags: req.body.tags,
                additionalFields: req.body.additionalFields,
                comments: [],
                likes: [],
            })
            parent.items.push(item._id)
            await item.save()
            await parent.save()
            return res.status(201).send({ message: "Added successfully!" })
        }
        res.status(403).send({
            message: "Only collection owner or admin can add items!",
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Add item error!" })
    }
}


// Edits item
exports.editItem = async (req, res) => {
    try {

        if (!validationResult(req).isEmpty()) {
            return res.status(400).send({ message: "Incorrect data provided!" })
        }

        let item = await Item.findOne({ _id: req.body._id }).populate("parent")
        
        if (`${item.parent.owner}` === req.user._id || req.user.role === "ADMIN") {
            await item.updateOne({
                name: req.body.name,
                tags: req.body.tags,
                additionalFields: req.body.additionalFields,
            })
            await item.save()
            return res.status(200).send({ message: "Edited successfully!" })
        }
        res.status(403).send({
            message: "Only collection owner or admin can edit items!",
        })
    } catch (error) {
        res.status(500).send({ message: "Edit item error!" })
    }
}

// Deletes item
exports.deleteItem = async (req, res) => {
    try {
        let item = await Item.findOne({ _id: req.params.id }).populate("parent")

        if (`${item.parent.owner}` === req.user._id || req.user.role === "ADMIN") {
            let index = item.parent.items.indexOf(item._id)
            item.parent.items.splice(index, 1)
            await item.parent.save()
            await item.deleteOne()
            return res.status(200).send({ message: "Deleted successfully!" })
        }

        res.status(403).send({
            message: "Only collection owner or admin can delete items!",
        })
    } catch (error) {
        res.status(500).send({ message: "Delete item error!" })
    }
}

// Adds comment to item
exports.setComment = async (req, res) => {
    try {

        let item = await Item.findOne({ _id: req.params.id })

        let user = await User.findOne({ _id: req.user._id })

        item.comments.push({
            author: user.username,
            comment: req.body.comment,
            time: new Date(),
        })
        await item.save()

        res.status(200).send()
    } catch (error) {
        res.status(500).send({ message: "Set comment error!" })
    }
}

// Toggles like to item
exports.toggleLike = async (req, res) => {
    try {
        let item = await Item.findOne({ _id: req.params.id })
        let user = await User.findOne({ _id: req.user._id })
        if (!user) {
            return res
                .status(403)
                .send({ message: "Only authorized users can like or dislike!" })
        }
        let userIndex = item.likes.findIndex((id) => id === `${user._id}`)
        userIndex === -1 ? item.likes.push(user._id) : item.likes.splice(userIndex, 1)
        await item.save()
        res.status(200).send(item.likes)
    } catch (error) {
        res.status(500).send({ message: "Like error!" })
    }
}
