const userController = require("../controllers/user.controller")
const { verifyToken } = require("../middlewares/verifyToken")
const checkStatus = require("../middlewares/checkStatus")
const checkDuplicate = require("../middlewares/checkDuplicate")
const { body } = require("express-validator")
const multer = require("multer")
const fastFolderSizeSync = require("fast-folder-size/sync")

// Storage for collections photo
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./content/images")
    },
    filename: (req, file, cb) => {
        cb(
            null,
            `${Math.random().toString().substring(2, 10)}.${file.mimetype.split("/")[1]}`
        )
    },
})

// Filter for collections photo
const fileFilter = (req, file, cb) => {
    const acceptTypes = /image\/(jpeg|jpg|png|svg)/gi

    const diskSize = fastFolderSizeSync("./content/images")
    // Not saved, if disk size < 200MB
    if (file.mimetype.match(acceptTypes) && diskSize < 209715200) {
        cb(null, true)
        return
    }
    cb(null, false)
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
})

exports.userRoutes = (app) => {
    app.get(
        "/api/user/userdata",
        verifyToken,
        checkStatus.isBlocked,
        userController.getUserData
    )

    app.get("/api/user/userPage/:username", verifyToken, userController.getUserPage)

    app.post(
        "/api/user/:username/createCollection",
        verifyToken,
        checkStatus.isBlocked,
        upload.single("collectionPhoto"),
        checkDuplicate.whenCreateCollection,
        body("name").notEmpty().isString().isLength({ min: 5, max: 50 }),
        body("topic").notEmpty().isString(),
        body("description").notEmpty().isString().isLength({ min: 10, max: 402 }),
        body("itemFields").custom((value) => {
            const fields = JSON.parse(value)
            const result = fields.map((field) => !!field["name"])
            return !result.includes(false) && fields.length <= 3
        }),
        userController.createCollection
    )

    app.patch(
        "/api/user/editCollection",
        verifyToken,
        checkStatus.isBlocked,
        upload.single("collectionPhoto"),
        checkDuplicate.whenEditCollection,
        body("name").notEmpty().isString().isLength({ min: 5, max: 50 }),
        body("topic").notEmpty().isString(),
        body("description").notEmpty().isString().isLength({ min: 10, max: 402 }),
        userController.editCollection
    )

    app.delete(
        "/api/user/deleteCollection/:id",
        verifyToken,
        checkStatus.isBlocked,
        userController.deleteCollection
    )

    app.post(
        "/api/user/addItem",
        verifyToken,
        checkStatus.isBlocked,
        // body("parent").notEmpty().isLength(24),
        // body("name").notEmpty().isString().isLength({ min: 5, max: 50 }),
        // body("tags").isArray({ min: 1, max: 5 }),
        // body("additionalFields").custom((fields) => {
        //     const result = fields.map((field) => !!field["value"])
        //     return !result.includes(false) && fields.length <= 3
        // }),
        userController.addItem
    )

    app.patch(
        "/api/user/editItem",
        verifyToken,
        checkStatus.isBlocked,
        body("parent").notEmpty().isLength(24),
        body("name").notEmpty().isString().isLength({ min: 5, max: 50 }),
        body("tags").isArray({ min: 1, max: 5 }),
        body("additionalFields").custom((fields) => {
            const result = fields.map((field) => !!field["value"])
            return !result.includes(false) && fields.length <= 3
        }),
        userController.editItem
    )

    app.delete(
        "/api/user/deleteItem/:id",
        verifyToken,
        checkStatus.isBlocked,
        userController.deleteItem
    )

    app.post(
        "/api/user/:id/comment",
        verifyToken,
        checkStatus.isBlocked,
        body("value").notEmpty(),
        userController.setComment
    )

    app.post(
        "/api/user/:id/toggleLike",
        verifyToken,
        checkStatus.isBlocked,
        userController.toggleLike
    )
}
