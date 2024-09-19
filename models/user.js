const mongoose = require("mongoose");
const bcryp = require("bcryptjs");

//Create Schema
const userSh = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: 2,
      require: [true, "name required"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "email required"],
      unique: true,
      lowercase: true,
    },
    phonenumber: String,
    profilePicture: String,

    password: {
      type: String,
      required: [true, "password required"],
      minLength: [6, "minimum length 6 in password"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

userSh.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  // bcrypt user password
  this.password = await bcryp.hash(this.password, 12);
  next();
});

const userMd = mongoose.model("user", userSh);

module.exports = userMd;
