const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const User = require("../models/User")

const JWT_SECRET = "adaptive_search_secret_key"

const generateToken = (id) =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" })

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body

    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ error: "Email already registered" })

    const user = await User.create({ name, email, password })

    res.json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      token: generateToken(user._id)
    })
  } catch (err) {
    console.error("Register error:", err.message)
    res.status(500).json({ error: "Registration failed" })
  }
})

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ error: "Invalid email or password" })

    const match = await user.matchPassword(password)
    if (!match) return res.status(401).json({ error: "Invalid email or password" })

    res.json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      token: generateToken(user._id)
    })
  } catch (err) {
    res.status(500).json({ error: "Login failed" })
  }
})

module.exports = router
