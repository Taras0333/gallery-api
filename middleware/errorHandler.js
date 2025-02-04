const { StatusCodes } = require('http-status-codes')

const errorHandler = (error, req, res, next) => {
  const errorState = {
    message: error.message || 'Something went wrong',
    statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  }
  // password issues
  if (error.errors?.password?.path === 'password') {
    ;(errorState.message = error.errors.password.properties.message),
      (errorState.statusCode = StatusCodes.BAD_REQUEST)
  }
  // last name issues
  if (error.code === 11000) {
    ;(errorState.message = 'Provided last name already exist'),
      (errorState.statusCode = StatusCodes.BAD_REQUEST)
  }
  if (error.kind === 'ObjectId') {
    ;(errorState.message = 'Something is not okay with provided id'),
      (errorState.statusCode = StatusCodes.BAD_REQUEST)
  }
  res.status(errorState.statusCode).json({ error: errorState.message })
}

module.exports = errorHandler
