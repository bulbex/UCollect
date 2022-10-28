const authController = require("../controllers/auth.controller")
const checkDuplicate = require("../middlewares/checkDuplicate")
const checkStatus = require("../middlewares/checkStatus")
const { verifyToken } = require("../middlewares/verifyToken")
const { body } = require("express-validator")

module.exports.authRoutes = (app) => {

    app.post(
        "/api/auth/signup",
        checkDuplicate.user,
        body("username").notEmpty().isLength({ min: 5, max: 20 }),
        body("email").notEmpty().isEmail(),
        body("password").notEmpty().isLength({ min: 5, max: 30 }),
        authController.signup
    )

    app.post(
        "/api/auth/signin",
        checkStatus.isBlocked,
        body("username").notEmpty(),
        body("password").notEmpty(),
        authController.signin
    )

    app.get("/api/auth/logout", verifyToken, authController.logout)
}
