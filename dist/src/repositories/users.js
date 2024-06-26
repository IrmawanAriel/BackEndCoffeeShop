"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTotalUser = exports.setImgUsers = exports.loginUser = exports.registerUser = exports.deleteUser = exports.createUser = exports.updateOneUsers = exports.getAllUsers = void 0;
const pg_1 = __importDefault(require("../configs/pg"));
const getAllUsers = (fullname, limit, page) => {
    let query = "select fullname, email, address from users";
    const values = [];
    if (fullname) {
        query += " where fullname ilike $1";
        values.push(`%${fullname}%`);
    }
    if (limit) {
        query += " limit $" + (values.length + 1);
        values.push(limit);
    }
    if (page && limit) {
        query += " offset $" + (values.length + 1);
        values.push((parseInt(page) - 1) * limit);
    }
    return pg_1.default.query(query, values);
};
exports.getAllUsers = getAllUsers;
const updateOneUsers = (body, id, hashed, image) => {
    const { fullname, email } = body;
    let query = "update users set ";
    const values = [];
    if (fullname) {
        query += `fullname = $${values.length + 1}, `;
        values.push(fullname);
    }
    if (email) {
        query += `email = $${values.length + 1}, `;
        values.push(email);
    }
    if (hashed) {
        query += `password = $${values.length + 1}, `;
        values.push(hashed);
    }
    if (image) {
        query += `image = $${values.length + 1} `;
        values.push(image);
    }
    query = query.slice(0, -2);
    query += ` where id = ${id} returning *`;
    return pg_1.default.query(query, values);
};
exports.updateOneUsers = updateOneUsers;
const createUser = (body) => {
    const Query = "insert into users (fullname, email, password) values ($1, $2, $3) returning *";
    const values = [body.fullname, body.email, body.password];
    return pg_1.default.query(Query, values);
};
exports.createUser = createUser;
const deleteUser = (id) => {
    const Query = "delete from users where id=$1 returning id";
    const values = [id];
    return pg_1.default.query(Query, values);
};
exports.deleteUser = deleteUser;
const registerUser = (body, hashed, image) => {
    let Query = "insert into users (fullname, email, password" + (image ? ", image" : "") + ") values ($1, $2, $3" + (image ? ", $4" : "") + ")";
    const values = [body.fullname, body.email, hashed];
    if (image)
        values.push(image);
    return pg_1.default.query(Query, values);
};
exports.registerUser = registerUser;
const loginUser = (email) => {
    const Query = "select fullname, password, role from users where email = $1";
    const values = [email];
    return pg_1.default.query(Query, values);
};
exports.loginUser = loginUser;
const setImgUsers = (email, image) => {
    const query = 'update users set image = $1 where email = $2 returning email, image';
    const values = [image || null, email];
    return pg_1.default.query(query, values);
};
exports.setImgUsers = setImgUsers;
const getTotalUser = (id) => {
    let query = "select count(*) as total_user from users";
    let values = [];
    if (id) {
        query += ' where id = $1';
        values.push(`${id}`);
    }
    return pg_1.default.query(query, values);
};
exports.getTotalUser = getTotalUser;
