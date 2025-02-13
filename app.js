require('dotenv').config()
require('express-async-errors')
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const limiter = require('express-rate-limit')
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')

const spinUpServer = require('./utils/serverSpinUp')
const endpointsDoc = YAML.load('./swagger.yaml')
const connectDB = require('./db/connection')
const { allowedOrigins } = require('./const')

const authRoute = require('./routes/auth')
const usersRoute = require('./routes/users')
const wakeUpRoute = require('./routes/wakeUp')

const errorHandler = require('./middleware/errorHandler')
const notFound = require('./middleware/notFound')

const server = express()

//middleware
server.use(express.json())
server.use(cookieParser(process.env.JWT_SECRET))
server.use(morgan('tiny'))

// security
server.use(helmet())
server.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
  })
)
server.use(xss())
server.use(
  limiter({
    windowMs: 15 * 60 * 1000,
    limit: 100,
  })
)

// routes
server.use('/api/v1/auth', authRoute)
server.use('/api/v1/users', usersRoute)
server.use('/api/v1/wake-up', wakeUpRoute)
server.use('/swagger', swaggerUI.serve, swaggerUI.setup(endpointsDoc))

// errors handle
server.use(notFound)
server.use(errorHandler)

const port = process.env.PORT || 5001

spinUpServer({ server, port, connectDB })
