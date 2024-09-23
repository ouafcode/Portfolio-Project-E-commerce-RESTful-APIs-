const express = require("express");

const router = express.Router();

const authController = require("../controllers/authControllers");

const {
  get_Coupons,
  create_Coupon,
  getCoupon_id,
  up_Coupon,
  del_Coupon,
} = require("../controllers/couponControllers");

router
  .route("/")
  .get(get_Coupons)
  .post(
    authController.auth,
    authController.permission("admin", "manager"),
    create_Coupon
  );
router
  .route("/:id")
  .get(getCoupon_id)
  .put(
    authController.auth,
    authController.permission("admin", "manager"),
    up_Coupon
  )
  .delete(authController.auth, authController.permission("admin"), del_Coupon);

module.exports = router;
