const mongoose = require("mongoose");

//Create Schema
const productSh = new mongoose.Schema(
  {
    title: {
      type: String,
      require: [true, "its required"],
      trim: true,
      minlength: [3, "Minimum three caracter"],
      maxlength: [100, "Maximum 32 caracter"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "description is required"],
      minlength: [20, "Too short desc"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
    },
    soldCounter: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "price required"],
      trim: true,
      max: [200000, "Maximum 20 caracter"],
    },
    //price after discount
    priceDisc: {
      type: Number,
    },
    colors: [String],
    // main image of product
    imageCover: {
      type: String,
      required: [true, "Image cover required"],
    },
    image: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must be attached to category"],
    },
    subCategory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Sub_Category",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    rateAverage: {
      type: Number,
      min: [1, "Rating of product must be minimum 1.0"],
      max: [5, "Rating of product must be maximum 5.0"],
    },
    rateQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Mongoose query Middlewqre
productSh.pre(/^find/, function (next) {
  this.populate({ path: "category", select: "name -_id" });
  next();
});

// Add URL to image
const AddImgURL = (doc) => {
  //return image with url and name
  if (doc.imageCover) {
    const imgUrl = `${process.env.BASE_URL}/product/${doc.imageCover}`;
    doc.imageCover = imgUrl;
  }
  if (doc.image) {
    const imagelist = [];
    doc.image.forEach((img) => {
      const imgUrl = `${process.env.BASE_URL}/product/${img}`;
      imagelist.push(imgUrl);
    });
    doc.image = imagelist;
  }
};
// add image URL when update , get
productSh.post("init", (doc) => {
  AddImgURL(doc);
});

// add image URL when create
productSh.post("save", (doc) => {
  AddImgURL(doc);
});

//Create model
module.exports = mongoose.model("Product", productSh);
