const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const {
  BadRequestError,
  CustomError,
  UnAuthorizedError,
} = require("../errors");

const register = async (req, res) => {
  const { body } = req;

  const user = await User.create({ ...body });

  const token = user.generateJWT();

  res.status(StatusCodes.CREATED).json({ user, token });
};

const login = async (req, res) => {
  const {
    body: { lastName, password },
  } = req;
  const user = await User.findOne({ lastName });

  if (!user) {
    throw new BadRequestError(
      `There is no user with provided lastName: ${lastName}`
    );
  }

  const isValidPassword = await user.validatePassword(password);

  if (!isValidPassword) {
    throw new UnAuthorizedError("The password is wrong");
  }
  const token = user.generateJWT();

  res.status(StatusCodes.ACCEPTED).json({ user, token });
};

module.exports = { register, login };
