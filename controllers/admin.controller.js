const User = require("../models/User.model")
const Collection = require("../models/Collection.model")
const Item = require("../models/Item.model")
const Role = require("../models/Role.model")
const fs = require("fs")


// Gets all users
exports.getUsers = async (req, res) => {
    try {
        let users = await User.find().populate("role").select("-collections -password")
        res.status(200).send(users)
    } catch (error) {
        res.status(500).send({message: "Get users error!"})
    }
}

// Unblocks users
exports.unblock = async (req, res) => {
    try {
        let users = await User.find({ _id: req.body.users })
        if (users) {
            users.forEach(async (user) => {
                user.status = "ACTIVE"
                await user.save()
            })
        }
        res.status(200).send({ message: "Success!"})
    } catch (error) {
        res.status(500).send({ message: "Unblock users error!"})
    }
}

// Blocks users
exports.block = async (req, res) => {
    try {
        let users = await User.find({ _id: req.body.users })
        if (users) {
            users.forEach(async (user) => {
                user.status = "BLOCKED"
                await user.save()
            })
        }
        res.status(200).send({ message: "Success!"})
    } catch (error) {
        res.status(500).send({ message: "Block users error!"})
    }
}

// Deletes user, his collections and items
exports.delete = async (req, res) => {
    try {
        let users = await User.find({ _id: req.body.users })
            .populate({ path: "collections", select: ["items", "photo"]})

        if (users) {
            users.forEach(async (user) => {
                user.collections.forEach(async (coll) => {
                    await Item.find({ _id: coll.items }).deleteMany()
                    coll.photo ? fs.unlinkSync(coll.photo) : null
                })
                await Collection.find({ _id: user.collections }).deleteMany()
                await user.deleteOne()
            })
        }
        res.status(200).send({ message: "Success!"})
    } catch (error) {
        res.status(500).send({ message: "Delete users error!"})
    }
}

// Makes users admins
exports.makeAdmin = async (req, res) => {
    try {
        let users = await User.find({ _id: req.body.users })
        let adminRole = await Role.findOne({ value: "ADMIN" })
        if (users) {
            users.forEach(async (user) => {
                user.role = adminRole
                await user.save()
            })
        }
        res.status(200).send({ message: "Success!"})
    } catch (error) {
        res.status(500).send({ message: "Make admin error!"})
    }
}

// Deletes users from admins
exports.deleteAdmin = async (req, res) => {
    try {
        let users = await User.find({ _id: req.body.users })
        let userRole = await Role.findOne({ value: "USER" })
        if (users) {
            users.forEach(async (user) => {
                user.role = userRole
                await user.save()
            })
        }
        res.status(200).send({ message: "Success!"})
    } catch (error) {
        res.status(500).send({ message: "Delete from admin error!"})
    }
}