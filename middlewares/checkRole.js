const User = require("../models/User.model")

// Checks if user is admin
exports.isAdmin = async (req, res, next) => {
    try {
        if (req.user.role !== "ADMIN") {
            return res.status(403).send({ message: "Forbidden!" })
        }
        next()
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Check role error!"})
    }
}

