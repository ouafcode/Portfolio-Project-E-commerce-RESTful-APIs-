const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");

dotenv.config({ path: "config.env" });
const ApiErr = require("./utils/ApiErr");
const errorHandling = require("./middlware/errorHandling");
const db = require("./config/db");
//Routes
const mountApis = require("./API");
//connect to databse
db();

// app server
const app = express();

app.use(cors());
app.options("*", cors());

app.use(compression());

// Middlewares request
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploadImg")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`node: ${process.env.NODE_ENV}`);
}

//Use Routes(API)
mountApis(app);

app.all("*", (req, res, next) => {
  next(new ApiErr(`Can't found the url: ${req.originalUrl}`, 400));
});

//Error Handling middlware
app.use(errorHandling);

const PORT = process.env.PORT || 8000;
const srv = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

// Customise error Outside Express by Events
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection Error: ${err.name} | ${err.message}`);
  srv.close(() => {
    console.error("app shuttdown");
    process.exit(1);
  });
});
