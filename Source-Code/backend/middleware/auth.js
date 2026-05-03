const jwt = require("jsonwebtoken")
const User = require("../models/User")

const JWT_SECRET = "adaptive_search_secret_key"

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ error: "Not authorized" })

  try {
    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = await User.findById(decoded.id).select("-password")
    next()
  } catch {
    res.status(401).json({ error: "Token invalid or expired" })
  }
}

module.exports = protect
