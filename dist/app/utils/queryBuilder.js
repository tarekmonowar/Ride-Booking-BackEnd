"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
const constants_1 = require("../constants");
//its build for reuseable neither if i call here Tour.find() here its works
class QueryBuilder {
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    filter() {
        const filter = { ...this.query };
        for (const field of constants_1.excludeField) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete filter[field];
        }
        this.modelQuery = this.modelQuery.find(filter); // Tour.find().find(filter)
        return this;
    }
    search(searchableField) {
        const searchTerm = this.query.searchTerm || "";
        const searchQuery = {
            $or: searchableField.map((field) => ({
                [field]: { $regex: searchTerm, $options: "i" },
            })),
        };
        this.modelQuery = this.modelQuery.find(searchQuery); // Tour.find().find(filter).find(searchQuery)
        return this;
    }
    sort() {
        const sort = this.query.sort || "-createdAt";
        this.modelQuery = this.modelQuery.sort(sort); // Tour.find().find(filter).find(searchQuery).sort()
        return this;
    }
    fields() {
        const fields = this.query.fields?.split(",").join(" ") || "";
        this.modelQuery = this.modelQuery.select(fields); // Tour.find().find(filter).find(searchQuery).sort().select()
        return this;
    }
    paginate() {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit); // Tour.find().find(filter).find(searchQuery).sort().select().skip().limit()
        return this;
    }
    build() {
        return this.modelQuery;
    }
    async getMeta() {
        const totalDocuments = await this.modelQuery.model.countDocuments();
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const totalPage = Math.ceil(totalDocuments / limit);
        return { page, limit, total: totalDocuments, totalPage };
    }
}
exports.QueryBuilder = QueryBuilder;
