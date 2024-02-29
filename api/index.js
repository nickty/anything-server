const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const authenticateToken = require('./middlewares/authenticateToken')
require('dotenv').config()

const app = express()
connectDB()

app.use(bodyParser.json())
app.use(morgan('dev'))
app.use('/', authRoutes)

app.get('/profile', authenticateToken, (req, res) => {
  res.send(req.user)
})

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
