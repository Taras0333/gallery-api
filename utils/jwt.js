const jwt = require('jsonwebtoken')

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET)

const createJWT = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET)
  return token
}

module.exports = { createJWT, isTokenValid }
