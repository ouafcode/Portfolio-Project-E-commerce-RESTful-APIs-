//Routes
const categoryApi = require("./categoryApi");
const subcategoryApi = require("./subcategoryApi");
const brandApi = require("./brandApi");
const productApi = require("./productApi");
const userApi = require("./userApi");
const authApi = require("./authApi");
const couponApi = require("./couponApi");
const cartApi = require("./cartApi");
const orderApi = require("./orderApi");

const mountApis = (app) => {
  //Use Routes)
  app.use("/api/v1/categories", categoryApi);
  app.use("/api/v1/subcategories", subcategoryApi);
  app.use("/api/v1/brands", brandApi);
  app.use("/api/v1/products", productApi);
  app.use("/api/v1/users", userApi);
  app.use("/api/v1/auth", authApi);
  app.use("/api/v1/coupons", couponApi);
  app.use("/api/v1/cart", cartApi);
  app.use("/api/v1/orders", orderApi);
};

module.exports = mountApis;
