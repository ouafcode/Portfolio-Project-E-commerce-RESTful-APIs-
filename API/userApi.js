const express = require("express");

const router = express.Router();

const subcategoryApi = require("./subcategoryApi");
const authController = require("../controllers/authControllers");

router.use("/:categoryId/subcategories", subcategoryApi);

const {
  getUser_Validator,
  createUser_Validor,
  upUser_Validator,
  delUser_Validator,
  upUserPassword_Validator,
  upUserLogged_Validator,
} = require("../utils/ValidatorsRules/userValidator");
const {
  get_Users,
  create_User,
  getUser_id,
  up_User,
  del_User,
  uploadImgUser,
  resizeImg,
  up_UserPassword,
  getUserLogged,
  updateUserLogged,
  updateUserLoggedData,
  DeactivateUser,
} = require("../controllers/userControllers");

router.use(authController.auth);

router.get("/getData", getUserLogged, getUser_id);
router.put("/updatePasswordLogged", updateUserLogged);
router.put("/updateDataLogged", upUserLogged_Validator, updateUserLoggedData);
router.delete("/DeactivateUser", DeactivateUser);

router.use(authController.permission("admin"));
router.put("/updatePassword/:id", upUserPassword_Validator, up_UserPassword);

router
  .route("/")
  .get(get_Users)
  .post(uploadImgUser, resizeImg, createUser_Validor, create_User);
router
  .route("/:id")
  .get(getUser_Validator, getUser_id)
  .put(uploadImgUser, resizeImg, upUser_Validator, up_User)
  .delete(delUser_Validator, del_User);

module.exports = router;
