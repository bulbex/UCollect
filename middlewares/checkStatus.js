const User = require("../models/User.model")

// Checks status
exports.isBlocked = async (req, res, next) => {
    try {
        if (req.user) {
            let user = await User.findOne({ _id: req.user._id })
            if (!user) {
                return res.status(404).send({ message: "User not found!"})
            }
            if (user.status === "BLOCKED") {
                return res.status(403).send({ message: "This account is blocked!"})
            }
            next()
        } else { // Checks user status when sign in
            let user = await User.findOne({ username: req.body.username })
            if (!user) {
                return res.status(404).send({ message: "User not found!" })
            }
            if (user.status === "BLOCKED") {
                return res.status(403).send({ message: "This account is blocked!"})
            }
            next()
        }
    } catch (error) {
        res.status(500).send("Check status error!")
    }
}