// exports.del_Product = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;

//   // if (!mongoose.Types.ObjectId.isValid(id)) {
//   //     return res.status(404).json({ msg: 'Invalid category ID' });
//   // }
//   const product = await productMd.findByIdAndDelete(id);
//   if (!product) {
//     return next(new ApiErr(`No product for this id ${id}`, 404));
//   }
//   res.status(204).send();
// });

// exports.del_Brand = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;

//   // if (!mongoose.Types.ObjectId.isValid(id)) {
//   //     return res.status(404).json({ msg: 'Invalid category ID' });
//   // }
//   const brand = await BrandMd.findByIdAndDelete(id);
//   if (!brand) {
//     return next(new ApiErr(`No brand for this id ${id}`, 404));
//   }
//   res.status(204).send();
// });

// exports.del_Category = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;

//   // if (!mongoose.Types.ObjectId.isValid(id)) {
//   //     return res.status(404).json({ msg: 'Invalid category ID' });
//   // }
//   const category = await categoryMd.findByIdAndDelete(id);
//   if (!category) {
//     return next(new ApiErr(`No category for this id ${id}`, 404));
//   }
//   res.status(204).send();
// });

// exports.del_subcategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;

//   // if (!mongoose.Types.ObjectId.isValid(id)) {
//   //     return res.status(404).json({ msg: 'Invalid category ID' });
//   // }
//   const subcategory = await Sub_categoryMd.findByIdAndDelete(id);
//   if (!subcategory) {
//     return next(new ApiErr(`No subcategory for this id ${id}`, 404));
//   }
//   res.status(204).send();
// });
