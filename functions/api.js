const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const serverless = require("serverless-http");
const router = express.Router();

const app = express();

// MongoDB connection
mongoose.connect(
  "mongodb+srv://nickty:Nick126721@anything.rs1frok.mongodb.net/?retryWrites=true&w=majority&appName=anything",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// User schema
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
});
const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.send("I am working");
});

// Registration endpoint
app.post("/register", async (req, res) => {
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

// Login endpoint
app.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("Invalid email or password");
  }
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send("Invalid email or password");
  }
  const token = jwt.sign({ userId: user._id, email: user.email }, "secret");
  res.header("auth-token", token).send(token);
});

// Example of protecting an endpoint
app.get("/profile", authenticateToken, (req, res) => {
  res.send(req.user);
});

function authenticateToken(req, res, next) {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send("Access denied");
  }
  try {
    const verified = jwt.verify(token, "secret");
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
}

// Start server
// app.listen(3000, () => {
//   console.log("Server is running on port 3000");
// });

app.use("/.netlify/functions/api", router);
module.exports.handler = serverless(app);
