"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorization = exports.jwtOptions = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.jwtOptions = {
    expiresIn: "6m", // token akan hangus dalam 5 menit
    issuer: process.env.JWT_ISSUER,
};
const authorization = (role) => (req, res, next) => {
    const bearerToken = req.header("Authorization");
    // console.log(req.);
    if (!bearerToken) {
        return res.status(401).json({
            msg: "forbien",
            err: "akses tak diperbolehkan"
        });
    }
    const token = bearerToken.split(" ")[1];
    // verifikasi jwt dengan secret key aplikasi
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, exports.jwtOptions, (err, payload) => {
        // kalo tidak valid, ditolak
        if (err) {
            return res.status(403).json({
                msg: err.message,
                err: err.name,
            });
        }
        // pengecekan role
        if (role) {
            if (!role.includes(payload.role)) {
                return res.status(403).json({
                    msg: "Forbidden",
                    err: "Akses tidak diperbolehkan",
                });
            }
        }
        // kalo valid, lanjut
        // req.userPayload = payload;
        next();
    });
};
exports.authorization = authorization;
