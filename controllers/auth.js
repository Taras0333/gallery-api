const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')

const { BadRequestError, CustomError, UnAuthorizedError } = require('../errors')

const register = async (req, res) => {
  const { email, name, password } = req.body

  const emailAlreadyExists = await User.findOne({ email })
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already exists')
  }

  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0
  const role = isFirstAccount ? 'admin' : 'user'

  const user = await User.create({
    name,
    email,
    password,
    role,
  })

  res.status(StatusCodes.CREATED).json({
    msg: `Success! User ${name} was created`,
  })
}

const login = async (req, res) => {
  const {
    body: { email, password },
  } = req

  if (!email || !password) {
    throw new BadRequestError(`Please provide email and password`)
  }
  const user = await User.findOne({ email })

  if (!user) {
    throw new BadRequestError(`There is no user with provided email: ${email}`)
  }

  const isValidPassword = await user.validatePassword(password)

  if (!isValidPassword) {
    throw new UnAuthorizedError('The password is wrong')
  }
  const token = user.generateJWT()

  res.status(StatusCodes.ACCEPTED).json({ user, token })
}

module.exports = { register, login }
