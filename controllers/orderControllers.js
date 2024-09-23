const stripe = require("stripe")(process.env.STRIP_KEY);
const asyncHandler = require("express-async-handler");
const orderMd = require("../models/order");
const cartMd = require("../models/cart");
const productMd = require("../models/product");
const handler = require("./handlers");
const ApiErr = require("../utils/ApiErr");

// @descp  create cash order
// @route  GET /api/v1/orders/cartId
// @access Private
exports.cre_cashOrder = asyncHandler(async (req, res, next) => {
  const tax = 0;
  const shippingPrice = 0;
  // Get cart by cart Id
  const cart = await cartMd.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiErr(`There no cart for this id ${req.params.cartId}`, 404)
    );
  }
  // Get order price based on cart price
  const cartPrice = cart.TotalPriceAfterDiscount
    ? cart.TotalPriceAfterDiscount
    : cart.TotalCartPrice;

  const TotalOrderPrice = cartPrice + tax + shippingPrice;

  // Create Order
  const order = await orderMd.create({
    user: req.user._id,
    Items: cart.Items,
    shippingAdress: req.body.shippingAdress,
    TotalOrderPrice,
  });
  // decrement product quantity
  if (order) {
    const bulkOption = cart.Items.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: {
          $inc: { quantity: -item.quantity, soldCounter: +item.quantity },
        },
      },
    }));
    await productMd.bulkWrite(bulkOption, {});

    //clear cart
    await cartMd.findByIdAndDelete(req.params.cartId);
  }
  res.status(201).json({ status: "success", data: order });
});

exports.filterOrder = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterObject = { user: req.user._id };
  next();
});

// @descp  Get all orders
// @route  GET /api/v1/orders
// @access Private
exports.getOrders = handler.getAllHandler(orderMd);

// @descp  Get order by id
// @route  GET /api/v1/orders/:id
// @access Private
exports.getOrder_id = handler.getHandler(orderMd);

// @descp  Update order for paid status
// @route  PUT /api/v1/orders/:id/paid
// @access Private
exports.updateOrder_paid = asyncHandler(async (req, res, next) => {
  const order = await orderMd.findById(req.params.id);
  if (!order) {
    return next(
      new ApiErr(`There is no order for this user : ${req.params.id}`, 404)
    );
  }

  order.Paid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({ status: "success", data: updatedOrder });
});

// @descp  Update order for delivered status
// @route  PUT /api/v1/orders/:id/deliver
// @access Private
exports.updateOrder_delivered = asyncHandler(async (req, res, next) => {
  const order = await orderMd.findById(req.params.id);
  if (!order) {
    return next(
      new ApiErr(`There is no order for this user : ${req.params.id}`, 404)
    );
  }

  order.Delivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({ status: "success", data: updatedOrder });
});

// @descp  Create checkout sessoin from stipe
// @route  GET /api/v1/orders/checkout
// @access Private
exports.createSession = asyncHandler(async (req, res, next) => {
  const tax = 0;
  const shippingPrice = 0;
  // Get cart by cart Id
  const cart = await cartMd.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiErr(`There no cart for this id ${req.params.cartId}`, 404)
    );
  }
  // Get order price based on cart price
  const cartPrice = cart.TotalPriceAfterDiscount
    ? cart.TotalPriceAfterDiscount
    : cart.TotalCartPrice;

  const TotalOrderPrice = cartPrice + tax + shippingPrice;

  // create session stripe
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "mad",
          product_data: {
            name: req.user.name,
          },
          unit_amount: TotalOrderPrice * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAdress,
  });
  res.status(200).json({ status: "success", session });
});
