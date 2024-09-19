const multer = require("multer");
const ApiErr = require("../utils/ApiErr");

const multerStorage = () => {
  // to store Image
  // const multiStorage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     cb(null, "uploadImg/category");
  //   },
  //   filename: function (req, file, cb) {
  //     const extension = file.mimetype.split("/")[1];
  //     const filename = `category-${uuidv4()}-${Date.now()}.${extension}`;
  //     cb(null, filename);
  //   },
  // });
  const multiStorage = multer.memoryStorage();

  // to validate type of Image
  const multiFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiErr("Only Image type accepted", 400), false);
    }
  };

  const uploadImg = multer({ storage: multiStorage, fileFilter: multiFilter });
  return uploadImg;
};

exports.uploadSingleImg = (fieldname) => multerStorage().single(fieldname);

exports.UploadMultiImg = (listofFields) => multerStorage().fields(listofFields);
