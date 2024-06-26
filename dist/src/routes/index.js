"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_1 = __importDefault(require("./product"));
const users_1 = __importDefault(require("./users"));
const promo_1 = __importDefault(require("./promo"));
const pesanan_1 = __importDefault(require("./pesanan"));
const mainrouter = (0, express_1.Router)();
mainrouter.use("/product", product_1.default);
mainrouter.use("/users", users_1.default);
mainrouter.use("/promo", promo_1.default);
mainrouter.use("/pesanan", pesanan_1.default);
exports.default = mainrouter;
