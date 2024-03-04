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
