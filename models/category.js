const mongoose = require("mongoose");

//Create Schema
const categorySh = new mongoose.Schema(
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
    const imgUrl = `${process.env.BASE_URL}/category/${doc.image}`;
    doc.image = imgUrl;
  }
};
// add image URL when update , get
categorySh.post("init", (doc) => {
  AddImgURL(doc);
});

// add image URL when create
categorySh.post("save", (doc) => {
  AddImgURL(doc);
});

//Create model
const categoryMd = mongoose.model("Category", categorySh);

module.exports = categoryMd;
