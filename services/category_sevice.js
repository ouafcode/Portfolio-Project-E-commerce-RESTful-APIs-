const Category_Model = require('../models/category_models');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError');
const slugify = require('slugify');

// @descr Get list of categories
// @Route GET /api/v1/categories
// @access Public
exports.getCategories = asyncHandler(async (req, res) => {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 4;
    const skip = (page - 1) * limit;
    const categories = await Category_Model.find({}).skip(skip).limit(limit);
    res.status(200).json({Result: categories.length, page, data: categories});
});

//@desc GET specific category by id
//@route GET /api/v1/categories/:id
//@access public
exports.getCategory = asyncHandler(async (req, res, next) => {
    const { ID } = req.params;
    const category = await Category_Model.findById(ID);
    if (!category) {
        return next(new ApiError(`not category founed for this ${ID}`, 404));
        }
    res.status(200).json({ data: category });
});

// @desc create_category
// @Route POST /api/v1/categories
// @access Private
exports.create_Category = asyncHandler( async(req, res) => {
    const name = req.body.name;
    const category = await Category_Model.create({name, slug:slugify(name) });
        res.status(201).json({data: category});
    
});


 
// @descr update spesific category
// @route PUT /api/v1/categories/:ID
// @access private

exports.apdate_category = asyncHandler(async(req, res, next) => {
    const {ID} = req.params;
    const {name} = req.body;

    const category = await Category_Model.findOneAndUpdate(
        {_id: ID},
        {name, slug: slugify(name)},
        {new: true});

    if (!category) {
        return next(new ApiError(`not category founed for this ${ID}`, 404));
    }
    res.status(200).json({ data: category });

});

// @descr delete spesific category
// @route DELET /api/v1/categories/:ID
// @access private

exports.delete_category = asyncHandler(async(req, res, next) => {
    const { ID} = req.params;
    const category = await Category_Model.findOneAndDelete(ID);

    if (!category) {
        return next(new ApiError(`not category founed for this ${ID}`, 404));
    }
    res.status(204).send();
});
