const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config({ path: "config.env" });
const ApiErr = require("./utils/ApiErr");
const errorHandling = require("./middlware/errorHandling");
const db = require("./config/db");
//Routes
const categoryApi = require("./API/categoryApi");
const subcategoryApi = require("./API/subcategoryApi");
const brandApi = require("./API/brandApi");
const productApi = require("./API/productApi");
const userApi = require("./API/userApi");
const authApi = require("./API/authApi");
//connect to databse
db();

// app server
const app = express();

// Middlewares request
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploadImg")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`node: ${process.env.NODE_ENV}`);
}

//Use Routes(API)
app.use("/api/v1/categories", categoryApi);
app.use("/api/v1/subcategories", subcategoryApi);
app.use("/api/v1/brands", brandApi);
app.use("/api/v1/products", productApi);
app.use("/api/v1/users", userApi);
app.use("/api/v1/auth", authApi);

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
