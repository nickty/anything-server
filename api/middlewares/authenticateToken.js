const jwt = require('jsonwebtoken')
require('dotenv').config()

function authenticateToken(req, res, next) {
  // Get the token from the request header
  const token = req.header('auth-token')
  if (!token) return res.status(401).send('Access Denied. No token provided.')

  try {
    // Verify the token
    const verified = jwt.verify(token, process.env.JWT_SECRET)
    req.user = verified
    next() // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(400).send('Invalid Token')
  }
}

module.exports = authenticateToken
