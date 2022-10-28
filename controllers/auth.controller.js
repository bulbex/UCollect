const User = require("../models/User.model")
const Role = require("../models/Role.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { validationResult } = require("express-validator")
require("dotenv").config()

// Sign up user
exports.signup = async (req, res) => {
    try {
        if (!validationResult(req).isEmpty()) {
            return res.status(400).send({ message: "Incorrect data provided!" })
        }

        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 7),
            role: await Role.findOne({ value: "USER" }),
            status: "ACTIVE",
            collections: [],
        })
        await user.save()

        res.status(201).send({ message: "Registered successfully!" })
    } catch (error) {
        res.status(500).send({ message: "Registration failed!" })
    }
}


// Sign in user
exports.signin = async (req, res) => {
    try {

        if (!validationResult(req).isEmpty()) {
            return res.status(400).send({ message: "Incorrect data provided!" })
        }

        let user = await User.findOne({ username: req.body.username }).populate("role")
        if (!user) {
            return res.status(404).send({ message: "User not found!" })
        }

        const validPassword = bcrypt.compareSync(req.body.password, user.password)
        if (!validPassword) {
            return res.status(401).send({ message: "Invalid password!" })
        }

        const token = jwt.sign({ _id: user._id, role: user.role.value }, process.env.SECRET_KEY, {
            expiresIn: "12h",
        })

        res.send({
            message: "Signed in successfully!",
            token: token,
        })
    } catch (error) {
        res.status(500).send({ message: "Sign in failed!" })
    }
}

// Log out user
exports.logout = async (req, res) => {
    try {

        const logoutToken = jwt.sign({ value: "LOG_OUT" }, "LOG_OUT_KEY", {
            expiresIn: "1",
        })

        res.send({
            message: "Logged out successfully!",
            token: logoutToken,
        })
    } catch (error) {
        res.status(500).send({ message: "Log out failed!" })
    }
}
