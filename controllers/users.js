const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");

const getAllUsers = async (req, res) => {
  const users = await User.find({});

  res.status(StatusCodes.OK).json({ users });
};
module.exports = { getAllUsers };
