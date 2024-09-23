const handler = require("./handlers");
const couponMd = require("../models/coupons");

// @descp  GET list conpons
// @route  GET /api/v1/coupons
// @access Private
exports.get_Coupons = handler.getAllHandler(couponMd);

// @descp  GET specific coupon by id
// @route  GET /api/v1/coupons/:id
// @access Private
exports.getCoupon_id = handler.getHandler(couponMd);

// @descp  Create coupon
// @route  POST /api/v1/coupons
// @access Private(admin)
exports.create_Coupon = handler.createHandler(couponMd);

// @descp  Update coupon
// @route  PUT /api/v1/coupons/:id
// @access Private(admin)
exports.up_Coupon = handler.updateHandler(couponMd);

// @descp  Delete coupon
// @route  DELETE /api/v1/coupons/:id
// @access Private(admin)
exports.del_Coupon = handler.deleteHandler(couponMd);
