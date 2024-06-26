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
exports.deletePromo = exports.UpdateOnePromo = exports.CreatePromo = exports.getAllPromoData = void 0;
const pg_1 = __importDefault(require("../configs/pg"));
const getAllPromoData = (voucher) => {
    let query = "select * from promo";
    let values = [];
    if (voucher) {
        query += " where voucher ilike $1";
        values.push(`%${voucher}%`);
    }
    return pg_1.default.query(query, values);
};
exports.getAllPromoData = getAllPromoData;
const CreatePromo = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const GetProductname = (product_name, id) => {
        product_name.forEach(element => {
            const values1 = [];
            const query = `INSERT INTO promo_product (product_id, promo_id) VALUES ((SELECT id FROM product WHERE product_name = $1 limit 1), ${id})`;
            values1.push(element);
            pg_1.default.query(query, values1);
        });
    };
    let query = "insert into promo (voucher, discount, activate, exp_date) values ($1,$2,$3,$4) returning id";
    const values = [body.voucher, body.discount, body.activate, body.exp_date];
    const result = yield pg_1.default.query(query, values);
    if (body.product_name) {
        const idPromo = result.rows[0].id;
        GetProductname(body.product_name, idPromo);
    }
    return result;
});
exports.CreatePromo = CreatePromo;
const UpdateOnePromo = (body, id) => {
    let query = "update promo set voucher =$1, discount =$2, activate =$3, exp_date=$4 where id=$5 RETURNING *";
    const values = [body.voucher, body.discount, body.activate, body.exp_date, id];
    return pg_1.default.query(query, values);
};
exports.UpdateOnePromo = UpdateOnePromo;
const deletePromo = (id) => {
    const Query = "delete from promo where id=$1 returning id";
    const values = [id];
    return pg_1.default.query(Query, values);
};
exports.deletePromo = deletePromo;
