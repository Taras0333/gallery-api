const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')

const { BadRequestError, UnAuthorizedError, CustomError } = require('../errors')

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

  let user = await User.create({ ...body })

  user = await User.findById(user.id).select('-password -__v')

  res.status(StatusCodes.CREATED).json({
    user,
  })
}

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError(`Please provide email and password`)
  }
  const user = await User.findOne({ email }).select('-password -__v')

  if (!user) {
    throw new BadRequestError(`There is no user with provided email: ${email}`)
  }

  const isValidPassword = await user.validatePassword(password)

  if (!isValidPassword) {
    throw new UnAuthorizedError('The password is wrong')
  }
  const token = user.generateJWT()

  res.status(StatusCodes.ACCEPTED).json({
    user,
    token,
  })
}

module.exports = { register, login }
