class ApiFeature {
  constructor(productQuery, queryStr) {
    this.productQuery = productQuery;
    this.queryStr = queryStr;
  }

  filter() {
    const queryStrObj = { ...this.queryStr };
    const Fieldstoexclude = ["page", "sort", "limit", "fields", "keyword"];
    Fieldstoexclude.forEach((field) => delete queryStrObj[field]);

    // to filter using : gte|gt|lte|lt
    let queryStr = JSON.stringify(queryStrObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.productQuery = this.productQuery.find(JSON.parse(queryStr));

    return this;
  }

  sorting() {
    if (this.queryStr.sort) {
      const querySort = this.queryStr.sort.split(",").join(" ");
      this.productQuery = this.productQuery.sort(querySort);
    } else {
      this.productQuery = this.productQuery.sort("-createAt");
    }
    return this;
  }

  limitDisplay() {
    if (this.queryStr.fields) {
      const field = this.queryStr.fields.split(",").join(" ");
      this.productQuery = this.productQuery.select(field);
    } else {
      this.productQuery = this.productQuery.select("-__v");
    }
    return this;
  }

  searching(model) {
    if (this.queryStr.keyword) {
      let query = {};
      if (model === "Product") {
        query.$or = [
          { title: { $regex: this.queryStr.keyword, $options: "i" } },
          { description: { $regex: this.queryStr.keyword, $options: "i" } },
        ];
      } else {
        query = { name: { $regex: this.queryStr.keyword, $options: "i" } };
      }

      this.productQuery = this.productQuery.find(query);
    }
    return this;
  }

  pagination(countDoc) {
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 50;
    const skip = (page - 1) * limit;
    const lastIndex = page * limit;

    const pagination = {};
    pagination.currPage = page;
    pagination.limit = limit;
    pagination.nbrPage = Math.ceil(countDoc / limit);

    if (lastIndex < countDoc) {
      pagination.next = page + 1;
    }
    if (skip > 0) {
      pagination.prev = page - 1;
    }

    this.productQuery = this.productQuery.skip(skip).limit(limit);
    this.paginationRes = pagination;
    return this;
  }
}

module.exports = ApiFeature;
