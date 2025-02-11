const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')

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

const getUserPaswords = async (_, res) => {
  const users = await User.find({}).select('password')

  res.status(StatusCodes.OK).json({ users })
}

module.exports = { getAllUsers, getUserById, getUserPaswords }
