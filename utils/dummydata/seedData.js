const fs = require("fs");
require("colors");
const dotenv = require("dotenv");
const product = require("../../models/product");
const db = require("../../config/db");

dotenv.config({ path: "../../config.env" });

// connect to database
db();

// Read data
const products = JSON.parse(fs.readFileSync("./products.json"));

// Add data into database
const addData = async () => {
  try {
    await product.create(products);

    console.log("Data Added".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete data from database
const deleteData = async () => {
  try {
    await product.deleteMany();
    console.log("Data Deleted".red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// node seeder.js -d
if (process.argv[2] === "-i") {
  addData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
