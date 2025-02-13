const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const BadRequestError = require('../errors/BadRequestError')

const removedFields = '-password -verified -isVerified -verificationToken'

const getAllUsers = async (_, res) => {
  const users = await User.find({}).select(removedFields)

  res.status(StatusCodes.OK).json({
    users,
    count: users.length,
  })
}
const getUserById = async (req, res) => {
  const {
    params: { id },
  } = req
  let user = await User.findById(id)

  user = await User.findById(id).select(removedFields)

  res.status(StatusCodes.OK).json({ user })
}

const updateUser = async (req, res) => {
  const { id } = req.user

  const forbiddenFields = removedFields.replace(/-/g, '').split(' ')

  const updates = structuredClone(req.body)

  forbiddenFields.forEach((field) => {
    if (updates.hasOwnProperty(field)) {
      delete updates[field]
    }
  })

  const updatedUser = await User.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  })

  if (!updatedUser) {
    throw new BadRequestError(`There is no user with provided id: ${id}`)
  }

  res.status(StatusCodes.OK).json({ user: updatedUser })
}

module.exports = { getAllUsers, getUserById, updateUser }
