const jwt = require('jsonwebtoken')
const Token = require('../models/Token')

const UnAuthorizedError = require('../errors/UnAuthorizedError')

const authenticateUser = async (req, res, next) => {
  const { headers } = req
  if (!headers.authorization || !headers.authorization.startsWith('Bearer ')) {
    throw new UnAuthorizedError('Please provide credentials')
  }

  try {
    const token = headers.authorization.split(' ')[1].trim()

    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { firstName: payload.firstName, id: payload.id }
    next()
  } catch (error) {
    throw new UnAuthorizedError('JWT token is invalid or missing')
  }
}

// const authorizePermissions = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       throw new UnauthorizedError(
//         'Unauthorized to access this route'
//       )
//     }
//     next()
//   }
// }

module.exports = {
  authenticateUser,
  // authorizePermissions,
}
