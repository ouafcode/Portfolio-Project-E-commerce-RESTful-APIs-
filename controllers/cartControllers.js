const asyncHandler = require("express-async-handler");
const ApiErr = require("../utils/ApiErr");

const productMd = require("../models/product");
const cartMd = require("../models/cart");
const couponMd = require("../models/coupons");

const calulateTotalPrice = (cart) => {
  let TotalPrice = 0;
  cart.Items.forEach((item) => {
    TotalPrice += item.quantity * item.price;
  });
  cart.TotalCartPrice = TotalPrice;
  cart.TotalPriceAfterDiscount = undefined;
  return TotalPrice;
};
// @descp  Add product to cart
// @route  POST /api/v1/cart/
// @access Private
exports.addToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await productMd.findById(productId);
  let cart = await cartMd.findOne({ user: req.user._id });
  if (!cart) {
    cart = await cartMd.create({
      user: req.user._id,
      Items: [{ product: productId, color, price: product.price }],
    });
  } else {
    const productExist = cart.Items.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );
    if (productExist > -1) {
      const Item = cart.Items[productExist];
      Item.quantity += 1;
      cart.Items[productExist] = Item;
    } else {
      cart.Items.push({ product: productId, color, price: product.price });
    }
  }

  calulateTotalPrice(cart);
  await cart.save();

  res
    .status(200)
    .json({ status: "Success", numberofItems: cart.Items.length, data: cart });
});

// @descp  Get cart for logged user
// @route  GET /api/v1/cart/
// @access Private
exports.getUserCart = asyncHandler(async (req, res, next) => {
  const cart = await cartMd.findOne({ user: req.user._id });

  if (!cart) {
    return next(new ApiErr(`No cart for this user id ${req.user._id}`, 404));
  }

  res
    .status(200)
    .json({ status: "Success", numberofItems: cart.Items.length, data: cart });
});

// @descp  remove cart items
// @route  GET /api/v1/cart/:itemId
// @access Private
exports.removeCartItem = asyncHandler(async (req, res, next) => {
  const cart = await cartMd.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { Items: { _id: req.params.itemId } } },
    { new: true }
  );

  calulateTotalPrice(cart);
  cart.save();

  res
    .status(200)
    .json({ status: "Success", numberofItems: cart.Items.length, data: cart });
});

// @descp  clear cart item
// @route  GET /api/v1/cart/
// @access Private
exports.clearCartItem = asyncHandler(async (req, res, next) => {
  await cartMd.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
});

// @descp  update item in cart
// @route  PUT /api/v1/cart/:itemId
// @access Private
exports.updateCartItem = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const cart = await cartMd.findOne({ user: req.user._id });

  if (!cart) {
    return next(
      new ApiErr(`there is no cart for ths user ${req.user._id}`, 404)
    );
  }
  const itemIndex = cart.Items.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );
  if (itemIndex > -1) {
    const item = cart.Items[itemIndex];
    item.quantity = quantity;
    cart.Items[itemIndex] = item;
  } else {
    return next(
      new ApiErr(`there is no item for this id ${req.params.itemId}`, 404)
    );
  }

  calulateTotalPrice(cart);
  await cart.save();
  res
    .status(200)
    .json({ status: "Success", numberofItems: cart.Items.length, data: cart });
});

// @descp  add coupon to Cart
// @route  PUT /api/v1/cart/applyCoupon
// @access Private
exports.addCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await couponMd.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new ApiErr(`Coupon is invalid`));
  }
  const cart = await cartMd.findOne({ user: req.user._id });
  const totalPrice = cart.TotalCartPrice;

  const totalPriceAfterDisc = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2);

  cart.TotalPriceAfterDiscount = totalPriceAfterDisc;
  await cart.save();

  res
    .status(200)
    .json({ status: "Success", numberofItems: cart.Items.length, data: cart });
});
