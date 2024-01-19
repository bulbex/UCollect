const { verifyToken } = require("../middlewares/verifyToken")
const dataController = require("../controllers/data.controller")
const checkStatus = require("../middlewares/checkStatus")

exports.dataRoutes = (app) => {

    app.get("/api/data/getMain", dataController.getMain)
    
    app.get("/api/data/getCollection/:collectionName", dataController.getCollection)

    app.get("/api/data/getItem/:id", dataController.getItem)
    
    app.get("/api/data/getTopics", verifyToken, checkStatus.isBlocked, dataController.getTopics)

    app.get("/api/data/tagAutocomplete", verifyToken, checkStatus.isBlocked, dataController.tagAutocomplete)

    app.get("/api/data/getItemFeedback/:id", dataController.getItemFeedback)

    app.get("/api/data/search", dataController.search)

}