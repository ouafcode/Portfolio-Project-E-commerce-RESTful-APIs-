const mongoose = require("mongoose");

//Create brand Schema
const orderSh = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: [true, "Order must be belong to user"],
    },
    Items: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        quantity: Number,
        color: String,
        price: Number,
      },
    ],
    tax: {
      type: Number,
      default: 0,
    },
    shippingAdress: {
      details: String,
      phoneNumber: String,
      city: String,
      postalCode: String,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
    TotalOrderPrice: {
      type: Number,
    },
    payementType: {
      type: String,
      enum: ["card", "cash"],
      default: "cash",
    },
    Paid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
    Delivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: Date,
  },
  { timestamps: true }
);

orderSh.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name profilePicture email phonenumber",
  }).populate({
    path: "Items.product",
    select: "title imageCover ",
  });

  next();
});

module.exports = mongoose.model("order", orderSh);
