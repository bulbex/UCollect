const Collection = require("../models/Collection.model")
const Item = require("../models/Item.model")
const { topics } = require("../content/topics/topics")

// Gets main page data
exports.getMain = async (req, res) => {
    try {

        // Last added items
        let items = await Item.find()
            .populate({
                path: "parent",
                select: ["name", "owner"],
                populate: {
                    path: "owner",
                    select: ["username"],
                },
            })
            .sort({ _id: -1 })
            .select("parent name tags")

        // Tags for tags cloud
        let tags = []
        items.forEach((item) => {
            tags.push(...item.tags)
        })
        tags = [...new Set(tags)]
        
        // Fife biggest collections
        let collections = (
            await Collection.find()
                .populate({
                    path: "owner",
                    select: ["username"],
                })
                .select("name topic items photo -_id")
        ).sort((a, b) => b.items.length - a.items.length)

        let mainData = {
            tags: tags.slice(0, 20),
            lastItems: items.slice(0, 5),
            biggestCollections: collections.slice(0, 5),
        }
        res.status(200).send(mainData)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Get main page error!" })
    }
}

// Gets topics for creating/editing collection
exports.getTopics = async (req, res) => {
    try {
        if (req.user) {
            return res.status(200).send({ topics: topics })
        }
        res.status(403).send({ message: "Forbidden!" })
    } catch (error) {
        res.status(500).send({ message: "Get topics error!" })
    }
}

// Tags autocomplete for adding/editing items
exports.tagAutocomplete = async (req, res) => {
    try {
        let queryString = req.query.query.toLowerCase()
        let items = await Item.find().select("tags -_id")
        // All tags from DB
        let tags = []
        let result = []
        items.forEach((item) => {
            tags.push(...item.tags)
        })
        tags = [...new Set(tags)]
        if (queryString && !tags.includes(`#${queryString}`)) {
            result = tags.filter((tag) => tag.toLowerCase().startsWith(queryString, 1))
        }
        res.status(200).send(result)
    } catch (error) {
        res.status(500).send({ message: "Autocomplete error!" })
    }
}

// Gets collection with sorting
exports.getCollection = async (req, res) => {
    try {
        let collection
        switch (req.query.sort) {
            case "addition date":
                collection = await Collection.findOne({
                    name: req.params.collectionName,
                }).populate({ path: "items", options: { sort: { _id: -1 } } })
                break
            case "alphabet":
                collection = await Collection.findOne({
                    name: req.params.collectionName,
                }).populate({ path: "items", options: { sort: { name: 1 } } })
                break
            case "likes":
                collection = await Collection.findOne({
                    name: req.params.collectionName,
                }).populate("items")
                collection.items.sort((a, b) => b.likes.length - a.likes.length)
                break
            case "comments":
                collection = await Collection.findOne({
                    name: req.params.collectionName,
                }).populate("items")
                collection.items.sort((a, b) => b.comments.length - a.comments.length)
                break
            default:
                collection = await Collection.findOne({
                    name: req.params.collectionName,
                }).populate({ path: "items", options: { sort: { _id: -1 } } })
                break
        }
        res.status(200).send(collection)
    } catch (error) {
        res.status(500).send({ message: "Get collection error!" })
    }
}

// Gets item
exports.getItem = async (req, res) => {
    try {
        let item = await Item.findOne({
            _id: req.params.id,
        }).populate({
            path: "parent",
            select: ["name", "owner"],
            populate: {
                path: "owner",
                select: ["username"],
            },
        })
        res.status(200).send(item)
    } catch (error) {
        res.status(500).send({ message: "Get item error!" })
    }
}

// Gets item comments and likes
exports.getItemFeedback = async (req, res) => {
    try {
        let item = await Item.findOne({
            _id: req.params.id,
        })
        res.status(200).send({ comments: item.comments, likes: item.likes })
    } catch (error) {
        res.status(500).send({ message: "Get comments error!" })
    }
}

// Full text search in items and collections names
exports.search = async (req, res) => {
    try {
        let items = await Item.find({
            $text: { $search: req.query.value },
        })
            .populate({
                path: "parent",
                select: ["name"],
                populate: {
                    path: "owner",
                    select: ["username"],
                },
            })
            .limit(10)
            .select("name parent")
        if (items.length) {
            return res.status(200).send(items)
        }
        let collection = await Collection.findOne({
            $text: { $search: req.query.value },
        })
            .populate({
                path: "items",
                select: ["name", "parent"],
                limit: 10,
                options: {
                    sort: { _id: -1 },
                },
                populate: {
                    path: "parent",
                    select: ["name", "owner"],
                    populate: {
                        path: "owner",
                        select: ["username"],
                    },
                },
            })
            .select("items")
        if (collection) {
            return res.status(200).send(collection.items)
        }
        return res.status(200).send([])
    } catch (error) {
        res.status(500).send({ message: "User Data Error" })
    }
}
