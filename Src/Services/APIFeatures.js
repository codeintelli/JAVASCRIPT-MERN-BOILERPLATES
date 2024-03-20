class APIFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const keyword = this.queryStr.keyword
            ? {
                  name: {
                      $regex: this.queryStr.keyword,
                      $options: 'i',
                  },
              }
            : {};
        this.query = this.query.find({ ...keyword });
        return this;
    }
    filter() {
        const queryCopy = { ...this.queryStr };
        const removeField = ['keyword', 'page', 'limit'];
        removeField.forEach((key) => delete queryCopy[key]);

        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|lt|lte|gte)\b/g, (key) => `$${key}`);
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }
    pagination(resultPerPage) {
        const current_page = Number(this.queryStr.page) || 1;
        const skipRecord = resultPerPage * (current_page - 1);
        this.query = this.query.limit(resultPerPage).skip(skipRecord);
        return this;
    }
}
export default APIFeatures;
