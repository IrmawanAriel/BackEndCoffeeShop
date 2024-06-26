"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProdImg = exports.getTotalProduct = exports.deleteProduct = exports.UpdateProduct = exports.createProduct = exports.GetOneProduct = exports.getAllProduct = void 0;
const pg_1 = __importDefault(require("../configs/pg"));
const getAllProduct = ({ category, harga_max, harga_min, limit, page, product_name, promo, sort, stock }) => {
    let query = `select * from product`; // 1.
    const values = [];
    if (promo === "tidak") {
        query += " LEFT JOIN promo_product ON product.id = promo_product.product_id WHERE promo_product.promo_id IS NULL"; // 2. left join
    }
    else {
        query += " INNER JOIN promo_product ON product.id = promo_product.product_id WHERE promo_product.promo_id IS NOT NULL"; // inner
    }
    query += " AND true";
    if (product_name) {
        query += " and product_name ilike $" + (values.length + 1);
        values.push(`%${product_name}%`);
    }
    // console.log(values.length)
    if (category) {
        query += " and category ilike $" + (values.length + 1);
        values.push(`%${category}%`);
    }
    if (stock === "tersedia") {
        query += " and stock !=0";
    }
    if (harga_min) {
        query += " and price >= $" + (values.length + 1);
        values.push(harga_min);
    }
    if (harga_max) {
        query += " and price <= $" + (values.length + 1);
        values.push(harga_max);
    }
    if (sort) { /// price asc
        const [column, order] = sort.split(' ');
        if (['asc', 'desc'].includes(order.toLowerCase()) && column) {
            query += ` order by ${column} ${order}`;
        }
    }
    if (limit) {
        query += " limit $" + (values.length + 1);
        values.push(limit);
    }
    if (page && limit) { //default val
        query += " offset $" + (values.length + 1);
        values.push((parseInt(page) - 1) * parseInt(limit));
    }
    // console.log(query);
    return pg_1.default.query(query, values);
};
exports.getAllProduct = getAllProduct;
const GetOneProduct = (product_name) => {
    const query = "SELECT * FROM product WHERE product_name = $1";
    const values = [product_name];
    console.log(product_name);
    return pg_1.default.query(query, values);
};
exports.GetOneProduct = GetOneProduct;
const createProduct = (body, image) => {
    const query = `insert into product (price, description, rating, product_name, stock, category, image)
        values ($1,$2,$3,$4,$5,$6,$7)
        returning *`;
    const { price, description, rating, product_name, stock, category } = body;
    const values = [price, description, rating, product_name, stock, category, image];
    return pg_1.default.query(query, values);
};
exports.createProduct = createProduct;
const UpdateProduct = (id, body, image) => {
    let query = "update product set ";
    const { price, description, rating, product_name } = body;
    const values = [];
    if (price !== undefined && price !== null) {
        query += `price = $${values.length + 1}, `;
        values.push(price);
    }
    if (description !== undefined && description !== null) {
        query += `description = $${values.length + 1}, `;
        values.push(description);
    }
    if (rating !== undefined && rating !== null) {
        query += `rating = $${values.length + 1}, `;
        values.push(rating);
    }
    if (product_name !== undefined && product_name !== null) {
        query += `product_name = $${values.length + 1}, `;
        values.push(product_name);
    }
    if (image) {
        query += `image = $${(values.length + 1)}, `;
        values.push(image);
    }
    query = query.slice(0, -2); //hapus koma dan spasi
    query += ` WHERE id=$${(values.length + 1)} RETURNING *`;
    values.push(id);
    console.log(query);
    return pg_1.default.query(query, values);
};
exports.UpdateProduct = UpdateProduct;
const deleteProduct = (id) => {
    const query = "delete from product where id = $1 returning id";
    const values = [id];
    return pg_1.default.query(query, values);
};
exports.deleteProduct = deleteProduct;
const getTotalProduct = ({ product_name }) => {
    let query = "select count(*) as total_product from product";
    let values = [];
    if (product_name) {
        query += ' where product_name ilike $1';
        values.push(`%${product_name}%`);
    }
    // console.log(query,values)
    return pg_1.default.query(query, values);
};
exports.getTotalProduct = getTotalProduct;
const getProdImg = (id, image) => {
    const query = "update product set image = $1 where id = $2 ";
    const values = [image || null, id];
    return pg_1.default.query(query, values);
};
exports.getProdImg = getProdImg;
