const Sub_categoryMd = require("../models/subCategory");
const handler = require("./handlers");

exports.Set_CategoryidBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// Concept Nested route
// GET /api/v1/categories/:categoryId/subcategories
exports.create_filterobj = (req, res, next) => {
  let filterObj = {};
  if (req.params.categoryId) filterObj = { category: req.params.categoryId };
  req.filterObject = filterObj;
  next();
};

// @descp  GET list subcategory
// @route  GET /api/v1/subcategories
// @access Public(users , admin)
exports.get_subcategory = handler.getAllHandler(Sub_categoryMd);

// @descp  GET specific category by id
// @route  GET /api/v1/categories/:id
// @access Public(users , admin)
exports.getsubcategory_id = handler.getHandler(Sub_categoryMd);

// @descp  Create subCategory
// @route  POST /api/v1/subcategoryAPI
// @access Private(admin)
exports.create_subCategory = handler.createHandler(Sub_categoryMd);

// @descp  Update subcategory
// @route  PUT /api/v1/subcategories
// @access Private(admin)
exports.up_subcategory = handler.updateHandler(Sub_categoryMd);

// @descp  Delete category
// @route  DELETE /api/v1/subcategories/:id
// @access Private(admin)
exports.del_subcategory = handler.deleteHandler(Sub_categoryMd);
