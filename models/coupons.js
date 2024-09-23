const mongoose = require("mongoose");

const couponSh = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name required"],
      unique: true,
    },
    expire: {
      type: Date,
      required: [true, "Expired time required"],
    },
    discount: {
      type: Number,
      required: [true, "Discount value required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupons", couponSh);
