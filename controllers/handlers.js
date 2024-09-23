const asyncHandler = require("express-async-handler");
const ApiErr = require("../utils/ApiErr");
const ApiFeature = require("../utils/ApiFeature");

exports.deleteHandler = (Modelname) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const doc = await Modelname.findByIdAndDelete(id);
    if (!doc) {
      return next(new ApiErr(`wrong id ${id}`, 404));
    }
    res.status(204).send();
  });

exports.updateHandler = (Modelname) =>
  asyncHandler(async (req, res, next) => {
    const doc = await Modelname.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!doc) {
      return next(new ApiErr(`wrong id ${req.params.id}`, 404));
    }
    res.status(200).json({ data: doc });
  });

exports.createHandler = (Modelname) =>
  asyncHandler(async (req, res) => {
    const doc = await Modelname.create(req.body);
    res.status(201).json({ data: doc });
  });

exports.getHandler = (Modelname) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Modelname.findById(id);
    if (!doc) {
      return next(new ApiErr(`wrong id ${id}`, 404));
    }
    res.status(200).json({ data: doc });
  });

exports.getAllHandler = (Modelname, model = "") =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObject) {
      filter = req.filterObject;
    }
    //create Query
    const countDoc = await Modelname.countDocuments();
    const apiFeatures = new ApiFeature(Modelname.find(filter), req.query)
      .pagination(countDoc)
      .filter()
      .searching(model)
      .limitDisplay()
      .sorting();

    // execute Query
    const { productQuery, paginationRes } = apiFeatures;
    const docs = await productQuery;

    res.status(200).json({ result: docs.length, paginationRes, data: docs });
  });
