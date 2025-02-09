const jwt = require('jsonwebtoken')

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET)

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET)
  return token
}

const attachCookiesToResponse = ({ res, domain, user, refreshToken }) => {
  const isLocalCall = domain.includes('localhost')
  console.log('domain', domain, isLocalCall)

  const accessTokenJWT = createJWT({ payload: { user } })
  const refreshTokenJWT = createJWT({ payload: { user, refreshToken } })

  const oneDay = 1000 * 60 * 60 * 24
  const longerExp = 1000 * 60 * 60 * 24 * 30

  res.cookie('accessToken', accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' && !isLocalCall,
    signed: true,
    sameSite:
      process.env.NODE_ENV === 'production' && !isLocalCall ? 'none' : 'lax',
    maxAge: oneDay,
  })

  res.cookie('refreshToken', refreshTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' && !isLocalCall,
    signed: true,
    sameSite:
      process.env.NODE_ENV === 'production' && !isLocalCall ? 'none' : 'lax',
    maxAge: longerExp,
  })
}

module.exports = { attachCookiesToResponse, createJWT, isTokenValid }
