const express = require("express");

const router = express.Router();

const authController = require("../controllers/authControllers");

const {
  addToCart,
  getUserCart,
  removeCartItem,
  clearCartItem,
  updateCartItem,
  addCoupon,
} = require("../controllers/cartControllers");

router.use(authController.auth, authController.permission("user"));
router.route("/").post(addToCart).get(getUserCart).delete(clearCartItem);

router.put("/addcoupon", addCoupon);

router.route("/:itemId").put(updateCartItem).delete(removeCartItem);

module.exports = router;
