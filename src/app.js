require("dotenv").config();
const express = require("express");

const morgan = require("morgan");

const compression = require("compression");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const redis = require("./configs/redis.conf");
const app = express();

//init middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173']
}));

app.use(cookieParser());
app.use(compression());

app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  })
);
//init db
require("./dbs/init.mongodb");
redis.status;

// init routes
app.use("", require("./routes"));

// handling error
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    stack: error.stack,
    message: error.message || "Internal Server Error",
  });
});
module.exports = app;
