const express = require('express')
const { createMessage } = require('../controllers/messageController') // Adjust the path as necessary
const { authenticateToken } = require('../middlewares/authenticateToken') // Assuming you have an authentication middleware

const router = express.Router()

// Route to handle creating a new message
// Use the authenticateToken middleware to protect this route
router.post('/create', authenticateToken, createMessage)

// You can add more message-related routes here

module.exports = router
