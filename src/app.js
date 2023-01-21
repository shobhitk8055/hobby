const express = require("express");
const mongoSanitize = require("express-mongo-sanitize");
var engine = require('ejs-layout');
const cors = require("cors");
const path = require("path");
const httpStatus = require("http-status");
const config = require("./config/config");
const routes = require("./routes/v1");
const { errorConverter, errorHandler } = require("./middlewares/error");
const ApiError = require("./utils/ApiError");

const app = express();

// Set EJS as templating engine
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', engine.__express);
app.use(express.static(path.join(__dirname, "assets")));

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(mongoSanitize());

// enable cors
app.use(cors());
app.options("*", cors());

// v1 api routes
app.use("/", routes);

// app.get("/", (req, res) => {
//   res.render("home");
// });

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
