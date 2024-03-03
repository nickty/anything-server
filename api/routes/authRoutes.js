const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();

router.get("/", async (req, res) => {
  res.send("Server is Okay!");
});

router.post("/register", async (req, res) => {
  // Registration logic...
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).send("User registered successfully");
  } catch (error) {
    res.status(400).send("Registration failed");
  }
});

// router.post("/login", async (req, res) => {
//   // Login logic...
//   const user = await User.findOne({ email: req.body.email });
//   if (!user) {
//     return res.status(400).send("Invalid email or password");
//   }
//   const validPassword = await bcrypt.compare(req.body.password, user.password);
//   if (!validPassword) {
//     return res.status(400).send("Invalid email or password");
//   }
//   const token = jwt.sign(
//     { userId: user._id, email: user.email },
//     process.env.JWT_SECRET
//   );
//   res.header("auth-token", token).send(token);
// });

router.post("/login", async (req, res) => {
  try {
    // Login logic...
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send("Invalid email or password");
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).send("Invalid email or password");
    }

    // Generate access token
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" } // Access token expires in 15 minutes
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" } // Refresh token expires in 7 days
    );

    // Send both tokens to the client
    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
