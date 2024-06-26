"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTotalPesanan = exports.deletDataPesanan = exports.UpdatePesanan = exports.createNewPesanan = exports.GetPesanan = void 0;
const pg_1 = __importDefault(require("../configs/pg"));
const GetPesanan = (id, page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    let query = `SELECT SUM(
                    CASE 
                        WHEN promo_product.promo_id IS NOT NULL THEN (product.price * (1 - promo.discount / 100)) * order_product.quantity
                        ELSE product.price
                    END
                 ) as total_order 
                 FROM orders 
                 JOIN order_product ON orders.id = order_product.order_id 
                 JOIN product ON order_product.product_id = product.id 
                 LEFT JOIN promo_product ON product.id = promo_product.product_id 
                 LEFT JOIN promo ON promo_product.promo_id = promo.id `;
    let values = [];
    if (id) {
        query += " WHERE orders.id = $" + (values.length + 1);
        values.push(`${id}`);
    }
    if (limit) {
        query += " LIMIT $" + (values.length + 1);
        values.push(limit);
    }
    if (page && limit) {
        query += " OFFSET $" + (values.length + 1);
        values.push((page - 1) * limit);
    }
    const result = yield pg_1.default.query(query, values);
    if (result.rows.length > 0) {
        let total_order = Math.round(result.rows[0].total_order);
        query = `UPDATE orders SET total = $1 WHERE id = $2`;
        values = [total_order, id];
        yield pg_1.default.query(query, values);
    }
    return result;
});
exports.GetPesanan = GetPesanan;
const createNewPesanan = (body) => {
    const query = "insert into orders (user_id, status,  ice, takeaway, total) values ($1,$2,$3,$4,$5)";
    const values = [body.user_id, body.status, body.ice, body.takeaway, body.total];
    return pg_1.default.query(query, values);
};
exports.createNewPesanan = createNewPesanan;
const UpdatePesanan = (body, id) => {
    const query = "UPDATE orders SET user_id = $1, status = $2, ice = $3, takeaway = $4, total = $5 WHERE id = $6 returning *";
    const values = [body.user_id, body.status, body.ice, body.takeaway, body.total, id];
    return pg_1.default.query(query, values);
};
exports.UpdatePesanan = UpdatePesanan;
const deletDataPesanan = (id) => {
    const query = "delete from orders where id=$1 returning id";
    const values = [id];
    return pg_1.default.query(query, values);
};
exports.deletDataPesanan = deletDataPesanan;
const getTotalPesanan = (id) => {
    let query = "select count(*) as total_order from orders";
    let values = [];
    if (id) {
        query += ' where id = $1';
        values.push(`${id}`);
    }
    // console.log(query,values)
    return pg_1.default.query(query, values);
};
exports.getTotalPesanan = getTotalPesanan;
