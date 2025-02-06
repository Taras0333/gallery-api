const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')

const { BadRequestError, UnAuthorizedError, CustomError } = require('../errors')

const register = async (req, res) => {
  const { body } = req

  const emailAlreadyExists = await User.findOne({ email: body.email })
  if (emailAlreadyExists) {
    throw new BadRequestError('Email already exists')
  }

  if (!body.firstName) {
    throw new CustomError('FirstName is emply', StatusCodes.NOT_ACCEPTABLE)
  }
  if (!body.lastName) {
    throw new CustomError('LastName is emply', StatusCodes.NOT_ACCEPTABLE)
  }
  if (!body.nickName) {
    throw new CustomError('NickName is emply', StatusCodes.NOT_ACCEPTABLE)
  }
  if (!body.company) {
    throw new CustomError('Company is emply', StatusCodes.NOT_ACCEPTABLE)
  }
  if (!body.email) {
    throw new CustomError('Email is emply', StatusCodes.NOT_ACCEPTABLE)
  }
  if (!body.password) {
    throw new CustomError('Password is emply', StatusCodes.NOT_ACCEPTABLE)
  }

  const user = await User.create({ ...body })

  const {
    firstName,
    lastName,
    company,
    linkedIn,
    nickName,
    postCode,
    phoneCode,
    phone,
    email,
    address,
    id,
  } = user

  res.status(StatusCodes.CREATED).json({
    user: {
      firstName,
      lastName,
      company,
      linkedIn,
      nickName,
      postCode,
      phoneCode,
      phone,
      email,
      address,
      id,
    },
  })
}

const login = async (req, res) => {
  const { body } = req

  if (!body.email || !body.password) {
    throw new BadRequestError(`Please provide email and password`)
  }
  const user = await User.findOne({ email: body.email })

  if (!user) {
    throw new BadRequestError(
      `There is no user with provided email: ${body.email}`
    )
  }

  const isValidPassword = await user.validatePassword(body.password)

  if (!isValidPassword) {
    throw new UnAuthorizedError('The password is wrong')
  }
  const token = user.generateJWT()

  const {
    firstName,
    lastName,
    company,
    linkedIn,
    nickName,
    postCode,
    phoneCode,
    phone,
    email,
    address,
    id,
  } = user

  res.status(StatusCodes.ACCEPTED).json({
    user: {
      firstName,
      lastName,
      company,
      linkedIn,
      nickName,
      postCode,
      phoneCode,
      phone,
      email,
      address,
      id,
    },
    token,
  })
}

module.exports = { register, login }
