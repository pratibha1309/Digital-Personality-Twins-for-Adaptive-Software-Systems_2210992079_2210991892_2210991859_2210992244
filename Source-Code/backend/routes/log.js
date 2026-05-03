const express = require("express")
const router = express.Router()
const axios = require("axios")
const Behavior = require("../models/Behavior")

router.post("/log", async (req, res) => {
  try {
    const { userId, query, linksOpened, clickPosition, decisionTime, scrollDepth } = req.body

    // Save behavior to MongoDB
    const newBehavior = new Behavior({
      userId,
      query,
      linksOpened:   linksOpened   || 0,
      clickPosition: clickPosition || 0,
      decisionTime:  decisionTime  || 0,
      scrollDepth:   scrollDepth   || 0
    })
    await newBehavior.save()

    // Call ML API with all 4 features
    const mlResponse = await axios.post("http://127.0.0.1:6000/predict", {
      linksOpened:   linksOpened   || 0,
      decisionTime:  decisionTime  || 0,
      scrollDepth:   scrollDepth   || 0,
      clickPosition: clickPosition || 0
    })

    res.json({
      message: "Saved + Predicted",
      personality: mlResponse.data.personality,
      cluster: mlResponse.data.cluster
    })

  } catch (error) {
    console.error("Log route error:", error.message)
    res.status(500).json({ error: "Error occurred" })
  }
})

// GET past behaviors for a user
router.get("/behaviors", async (req, res) => {
  try {
    const { userId } = req.query
    const behaviors = await Behavior.find({ userId }).sort({ _id: 1 }).limit(50)
    res.json(behaviors)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch behaviors" })
  }
})

module.exports = router
