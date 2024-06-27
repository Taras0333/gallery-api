const { UnAuthorizedError } = require("../errors");
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const { headers } = req;
  if (!headers.authorization || !headers.authorization.startsWith("Bearer ")) {
    throw new UnAuthorizedError("Please provide credentials");
  }

  try {
    const token = headers.authorization.split(" ")[1].trim();

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userName: payload.fullName, userId: payload.id };
    next();
  } catch (error) {
    throw new UnAuthorizedError("JWT token is invalid or missing");
  }
};

module.exports = auth;
