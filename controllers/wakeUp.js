const { StatusCodes } = require('http-status-codes')

const wakeUp = async (_, res) => {
  res
    .status(StatusCodes.OK)
    .json({ status: 'success', message: 'The server has been waked up!' })
}

module.exports = { wakeUp }
