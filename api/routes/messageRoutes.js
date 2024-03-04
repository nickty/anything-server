const express = require("express");
const {
  createMessage,
  getMessagesByUser,
} = require("../controllers/messageController"); // Adjust the path as necessary
const authenticateToken = require("../middlewares/authenticateToken");

const router = express.Router();

// Route to handle creating a new message
// Use the authenticateToken middleware to protect this route
router.post("/create", authenticateToken, createMessage);
router.get("/allmessages", authenticateToken, getMessagesByUser);

// You can add more message-related routes here

module.exports = router;
