const jwt = require("jsonwebtoken")
require("dotenv").config()

// Verifies user token
exports.verifyToken = (req, res, next) => {
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        let token = req.headers.authorization.split(" ")[1]
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).send({ message: "Not authorized!" })
    }
}
