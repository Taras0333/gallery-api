const { StatusCodes } = require("http-status-codes");

const notFound = (req, res) =>
  res.status(StatusCodes.NOT_FOUND).json({ error: "The page is not found" });

module.exports = notFound;
