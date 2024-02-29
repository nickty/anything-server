const mongoose = require('mongoose')
require('dotenv').config()

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('connection error:', error)
    process.exit(1)
  }
}

module.exports = connectDB
