const { StatusCodes } = require('http-status-codes')

const MockedData = require('../mock')

const getAllPictures = async (_, res) => {
  res.status(StatusCodes.OK).json(MockedData)
}

module.exports = {
  getAllPictures,
}
