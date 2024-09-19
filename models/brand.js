const mongoose = require("mongoose");

//Create brand Schema
const brandSh = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "its required"],
      unique: [true, "Should be unique"],
      minlength: [3, "Minimum three caracter"],
      maxlength: [32, "Maximum 32 caracter"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

// Add URL to image
const AddImgURL = (doc) => {
  //return image with url and name
  if (doc.image) {
    const imgUrl = `${process.env.BASE_URL}/brand/${doc.image}`;
    doc.image = imgUrl;
  }
};
// add image URL when update , get
brandSh.post("init", (doc) => {
  AddImgURL(doc);
});

// add image URL when create
brandSh.post("save", (doc) => {
  AddImgURL(doc);
});
//export module
module.exports = mongoose.model("Brand", brandSh);
