const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')

const removedFields = '-password -verified -isVerified -verificationToken'

const getAllUsers = async (_, res) => {
  const users = await User.find({}).select('-password')

  res.status(StatusCodes.OK).json({
    users,
    count: users.length,
  })
}
const getUserById = async (req, res) => {
  const {
    params: { id },
  } = req
  const user = await User.findById(id).select(removedFields)

  res.status(StatusCodes.OK).json({ user })
}

module.exports = { getAllUsers, getUserById }
