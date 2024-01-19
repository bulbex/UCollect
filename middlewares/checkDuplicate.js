const User = require("../models/User.model")
const Collection = require("../models/Collection.model")
const fs = require("fs")

// Checks if user with this username/email exists
exports.user = async (req, res, next) => {
    try {
        let usernameExist = await User.findOne({ username: req.body.username })

        if (usernameExist) {
            res.status(400).send({ message: "Username is already in use!" })
            return
        }

        let emailExist = await User.findOne({ email: req.body.email })

        if (emailExist) {
            res.status(400).send({ message: "Email is already in use!" })
            return
        }
        
        next()
    } catch (error) {
        return res.status(500).send({ message: "Something bad happened!" })
    }
}

// Checks if collection with this name exists when create collection
exports.whenCreateCollection = async (req, res, next) => {
    try {
        let collection = await Collection.findOne({ name: req.body.name })
        if (collection) {
            req.file ? fs.unlinkSync(req.file.path) : null
            res.status(400).send({ message: "Collection with this name already exists!" })
            return
        }
        next()
    } catch (error) {
        return res.status(500).send({ message: "Something bad happened!" })
    }
}

// Checks if collection with this name exists when edit collection
exports.whenEditCollection = async (req, res, next) => {
    try {
        let collection = await Collection.findOne({ name: req.body.name })
        if (collection && `${collection._id}` !== req.body._id) {
            req.file ? fs.unlinkSync(req.file.path) : null
            res.status(400).send({ message: "Collection with this name already exists!" })
            return
        }
        next()
    } catch (error) {
        return res.status(500).send({ message: "Something bad happened!" })
    }
}
