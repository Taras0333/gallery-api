const User = require('../models/User')
// const Token = require('../models/Token')
const { StatusCodes } = require('http-status-codes')
const crypto = require('crypto')
const { attachCookiesToResponse } = require('../utils/jwt')
const createTokenUser = require('../utils/createTokenUser')

const { BadRequestError, UnAuthorizedError, CustomError } = require('../errors')

const removedFields = '-password -verified -isVerified -verificationToken'

const register = async (req, res) => {
  const { body } = req
  const { firstName, lastName, nickName, company, email, password } = body

  const emailAlreadyExists = await User.findOne({ email })
  if (emailAlreadyExists) {
    throw new BadRequestError('Email already exists')
  }

  if (!firstName) {
    throw new CustomError('FirstName is emply', StatusCodes.NOT_ACCEPTABLE)
  }
  if (!lastName) {
    throw new CustomError('LastName is emply', StatusCodes.NOT_ACCEPTABLE)
  }
  if (!nickName) {
    throw new CustomError('NickName is emply', StatusCodes.NOT_ACCEPTABLE)
  }
  if (!company) {
    throw new CustomError('Company is emply', StatusCodes.NOT_ACCEPTABLE)
  }
  if (!email) {
    throw new CustomError('Email is emply', StatusCodes.NOT_ACCEPTABLE)
  }
  if (!password) {
    throw new CustomError('Password is emply', StatusCodes.NOT_ACCEPTABLE)
  }

  // const verificationToken = crypto.randomBytes(40).toString('hex')
  let user = await User.create({
    ...body,
    verificationToken: '',
    isVerified: true,
    verified: Date.now(),
  })

  user = await User.findById(user.id).select(removedFields)

  res.status(StatusCodes.CREATED).json({
    user,
  })
}

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError(`Please provide email and password`)
  }
  let user = await User.findOne({ email })

  if (!user) {
    throw new BadRequestError(`There is no user with provided email: ${email}`)
  }

  const isValidPassword = await user.validatePassword(password)

  if (!isValidPassword) {
    throw new UnAuthorizedError('The password is wrong')
  }
  if (!user.isVerified) {
    throw new UnAuthorizedError('Please verify your email')
  }

  const tokenUser = createTokenUser(user)

  // create refresh token
  let refreshToken = ''
  // check for existing token
  // const existingToken = await Token.findOne({ user: user.id })

  // if (existingToken) {
  //   const { isValid } = existingToken
  //   if (!isValid) {
  //     throw new UnauthenticatedError('Invalid Credentials')
  //   }
  //   refreshToken = existingToken.refreshToken
  //   attachCookiesToResponse({ res, domain: req.headers['origin'], user: tokenUser, refreshToken })
  //   res.status(StatusCodes.OK).json({ user: tokenUser })
  //   return
  // }

  refreshToken = crypto.randomBytes(40).toString('hex')
  // const userAgent = req.headers['user-agent']
  // const ip = req.ip
  // const userToken = { refreshToken, ip, userAgent, user: user.id }

  // await Token.create(userToken)

  attachCookiesToResponse({
    res,
    domain: req.headers['origin'],
    user: tokenUser,
    refreshToken,
  })

  user = await User.findById(user.id).select(removedFields)

  res.status(StatusCodes.ACCEPTED).json({ user })
}

const logout = async (req, res) => {
  // await Token.findOneAndDelete({ user: req.user.userId })

  const isLocalCall = req.headers['origin']?.includes('localhost')

  res.cookie('accessToken', '0', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' && !isLocalCall,
    signed: true,
    sameSite:
      process.env.NODE_ENV === 'production' && !isLocalCall ? 'none' : 'lax',
    expires: new Date(0),
  })
  res.cookie('refreshToken', '0', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' && !isLocalCall,
    signed: true,
    sameSite:
      process.env.NODE_ENV === 'production' && !isLocalCall ? 'none' : 'lax',
    expires: new Date(0),
  })
  res.status(StatusCodes.OK).json({ message: 'User has logged out!' })
}

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body
  const user = await User.findOne({ email })

  if (!user) {
    throw new CustomError.UnauthenticatedError(
      `There is no user with provided email: ${email}`
    )
  }

  if (user.verificationToken !== verificationToken) {
    throw new CustomError.UnauthenticatedError('Verification Failed')
  }

  user.isVerified = true
  user.verified = Date.now()
  user.verificationToken = ''

  await user.save()

  res.status(StatusCodes.OK).json({ msg: 'Verification was Successful' })
}

module.exports = { register, login, verifyEmail, logout }
