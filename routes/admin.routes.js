const checkRole = require("../middlewares/checkRole")
const { verifyToken } = require("../middlewares/verifyToken")
const adminController = require("../controllers/admin.controller")
const checkStatus = require("../middlewares/checkStatus")

exports.adminRoutes = (app) => {

    app.get("/api/admin/getUsers", verifyToken, checkStatus.isBlocked, checkRole.isAdmin, adminController.getUsers)

    app.patch("/api/admin/unblock", verifyToken, checkStatus.isBlocked, checkRole.isAdmin, adminController.unblock)

    app.patch("/api/admin/block", verifyToken, checkStatus.isBlocked, checkRole.isAdmin, adminController.block)

    app.delete("/api/admin/delete", verifyToken, checkStatus.isBlocked, checkRole.isAdmin, adminController.delete)

    app.patch("/api/admin/makeAdmin", verifyToken, checkStatus.isBlocked, checkRole.isAdmin, adminController.makeAdmin)

    app.patch("/api/admin/deleteAdmin", verifyToken, checkStatus.isBlocked, checkRole.isAdmin, adminController.deleteAdmin)

}
