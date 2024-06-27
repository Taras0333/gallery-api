require("dotenv").config();
require("express-async-errors");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const limiter = require("express-rate-limit");

const propertiesRoute = require("./routes/properties");
const authRoute = require("./routes/auth");
const usersRoute = require("./routes/users");

const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");

const connectDB = require("./db/connection");
const server = express();

//middleware
server.use(express.json());

// security
server.use(helmet());
server.use(cors());
server.use(xss());
server.use(
  limiter({
    windowMs: 15 * 60 * 1000,
    limit: 100,
  })
);

// routes
server.use("/api/v1/auth", authRoute);
server.use("/api/v1/users", usersRoute);
server.use("/api/v1/properties", propertiesRoute);

// errors handle
server.use(notFound);
server.use(errorHandler);

const port = process.env.PORT || 5001;

const spinUpServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("db is connected");
    server.listen(port, () => {
      console.log(`The server is listening to port: ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};
spinUpServer();
