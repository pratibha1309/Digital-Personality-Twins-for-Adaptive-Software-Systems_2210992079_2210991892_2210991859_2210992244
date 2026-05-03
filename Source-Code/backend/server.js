const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const searchRoutes = require("./routes/search")
const logRoutes    = require("./routes/log")
const authRoutes   = require("./routes/auth")

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api", searchRoutes)
app.use("/api", logRoutes)

mongoose.connect("mongodb://127.0.0.1:27017/adaptiveSearch")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB connection error:", err))

app.listen(5000, () => console.log("Server running on port 5000"))
