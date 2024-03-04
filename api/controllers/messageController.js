const Message = require("../models/Message");
const User = require("../models/User");

exports.createMessage = async (req, res) => {
  try {
    const { userId } = req.user;

    // console.log("first", req.user);

    // Optional: Check if the userId exists in the User model to ensure validity
    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found");

    const message = new Message({
      userId,
      text: req.body.text,
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).send("Error saving message");
  }
};

exports.getMessagesByUser = async (req, res) => {
  try {
    const { userId } = req.user; // If you're using JWT and user information is stored in req.user

    console.log("working");

    // Optional: Verify the user exists
    const userExists = await User.findById(userId);
    if (!userExists) return res.status(404).send("User not found");

    // Find all messages by userId
    const messages = await Message.find({ userId: userId });
    if (!messages)
      return res.status(404).send("No messages found for this user");

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching user messages:", error);
    res.status(500).send("Error fetching messages");
  }
};
