const mongoose = require("mongoose");

//Create Schema
const sub_categorySh = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      require: [true, "its required"],
      unique: [true, "Should be unique"],
      minlength: [2, "Minimum two caracter"],
      maxlength: [32, "Maximum 32 caracter"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "category",
      required: [true, "Subcategory must contain main category"],
    },
  },
  { timestamps: true }
);

//Create model
const Sub_categoryMd = mongoose.model("Sub_Category", sub_categorySh);

module.exports = Sub_categoryMd;
