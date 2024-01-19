const express = require("express")
const app = express()
const mongoose = require("mongoose")
const authRoutes = require("./routes/auth.routes").authRoutes
const userRoutes = require("./routes/user.routes").userRoutes
const dataRoutes = require("./routes/data.routes").dataRoutes
const adminRoutes = require("./routes/admin.routes").adminRoutes
require("dotenv").config()

const PORT = process.env.PORT || 3000

const dbConfig = process.env.MONGODB_URI

mongoose.connect(
    dbConfig,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (error) => {
        error ? console.log(error) : console.log("Successfully connected to mongoDB!")
    }
)

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use("/content", express.static("content/"))

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "*")
    res.header("Access-Control-Allow-Credentials", true)
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE")
    next()
})

authRoutes(app)

userRoutes(app)

dataRoutes(app)

adminRoutes(app)

app.use(express.static("_frontend/dist/frontend"))

app.get("*", (req, res) => {
    res.sendFile(__dirname + "/_frontend/dist/frontend/index.html")
})

app.listen(PORT, () => {
    console.log(`Running app on port ${PORT}`)
})
