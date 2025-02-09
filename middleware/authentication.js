const CustomError = require('../errors')
const { isTokenValid, attachCookiesToResponse } = require('../utils/jwt')
const Token = require('../models/Token')

const UnauthenticatedError = require('../errors/UnAuthorizedError')

const authenticateUser = async (req, res, next) => {
  const { refreshToken, accessToken } = req.signedCookies

  try {
    if (accessToken) {
      const payload = isTokenValid(accessToken)
      req.user = payload.user
      return next()
    }
    const payload = isTokenValid(refreshToken)

    const existingToken = await Token.findOne({
      user: payload.user.userId,
      refreshToken: payload.refreshToken,
    })

    if (!existingToken || !existingToken?.isValid) {
      throw new UnauthenticatedError('Authentication Invalid')
    }

    attachCookiesToResponse({
      res,
      status: 'active',
      user: payload.user,
      refreshToken: existingToken.refreshToken,
    })

    req.user = payload.user
    next()
  } catch (error) {
    throw new UnauthenticatedError('Authentication Invalid')
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
