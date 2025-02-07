const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')

const getAllUsers = async (req, res) => {
  const users = await User.find({}).select('-password -__v')

  res.status(StatusCodes.CREATED).json({
    users,
    count: users.length,
  })
}
const getUserById = async (req, res) => {
  const {
    params: { id },
  } = req
  const user = await User.findById(id).select('-password -__v')

  res.status(StatusCodes.CREATED).json({ user })
}

module.exports = { getAllUsers, getUserById }
