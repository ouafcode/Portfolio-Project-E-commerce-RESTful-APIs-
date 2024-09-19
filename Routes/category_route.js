
const express = require('express');

const {
    getCategories,
    getCategory,
    create_Category,
    delete_category,
    apdate_category
} = require('../sevices/category_sevice');

const router = express.Router();


router.route("/").get(getCategories).post(create_Category);
router.route("/:ID").get(getCategory).put(apdate_category).delete(delete_category);

module.exports = router;