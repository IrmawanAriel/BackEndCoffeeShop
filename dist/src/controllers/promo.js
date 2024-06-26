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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOnePromo = exports.UpdatePromo = exports.CreateNewPromo = exports.getPromo = void 0;
const promo_1 = require("../repositories/promo");
const getPromo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { voucher } = req.query;
        const result = yield (0, promo_1.getAllPromoData)(voucher);
        if (result.rows.length === 0) {
            return res.status(404).json({
                msg: 'data tak ditemukan',
                data: [],
            });
        }
        return res.status(200).json({
            msg: "sucses",
            data: result.rows
        });
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
        }
        return res.status(500).json({
            msg: "error",
            err: "internal server error"
        });
    }
});
exports.getPromo = getPromo;
const CreateNewPromo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const result = yield (0, promo_1.CreatePromo)(body);
        return res.status(201).json({
            msg: 'succes created',
            data: result.rows
        });
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
        }
        return res.status(500).json({
            msg: "error",
            err: "internal server error"
        });
    }
});
exports.CreateNewPromo = CreateNewPromo;
const UpdatePromo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const id = req.params.id;
        const result = yield (0, promo_1.UpdateOnePromo)(body, id);
        return res.status(201).json({
            msg: 'succes created',
            data: result.rows
        });
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
        }
        return res.status(500).json({
            msg: "error",
            err: "internal server error"
        });
    }
});
exports.UpdatePromo = UpdatePromo;
const deleteOnePromo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const result = yield (0, promo_1.deletePromo)(id);
        return res.status(200).json({
            msg: " delete sucses",
            data: result.rows
        });
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
        }
        return res.status(500).json({
            msg: "error",
            err: `internal  server error`
        });
    }
});
exports.deleteOnePromo = deleteOnePromo;
