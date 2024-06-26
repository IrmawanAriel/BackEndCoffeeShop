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
exports.deleteOnePesanan = exports.updateOnePesanan = exports.createPesanan = exports.GetPesananData = void 0;
const Pesanan_1 = require("../repositories/Pesanan");
const getLink_1 = __importDefault(require("../helpers/getLink"));
const GetPesananData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { page, limit } = req.query;
        // console.log(page, limit, id)
        const result = yield (0, Pesanan_1.GetPesanan)(id, parseInt(page), parseInt(limit));
        if (result.rows.length === 0) {
            return res.status(404).json({
                msg: 'data tak ditemukan',
                data: [],
            });
        }
        //mendaptkan total pesanan
        const TotdataPesanan = yield (0, Pesanan_1.getTotalPesanan)(id);
        //mendapatkan value page untuk di oper ke response
        const pageOrder = parseInt(page) || 1;
        //mendapatkan jumlah total pesanan 
        const totalData = parseInt(TotdataPesanan.rows[0].total_order);
        //mendapatkan data total page
        const totalPage = Math.ceil(totalData / (parseInt(req.query.limit || '3'))); // assign default limit 3 karna error "limit possible to undefined"
        return res.status(200).json({
            msg: "sucses",
            data: result.rows,
            meta: {
                totalData,
                totalPage,
                page,
                prevLink: pageOrder > 1 ? (0, getLink_1.default)(req, "previous") : null,
                nextLink: pageOrder != totalPage ? (0, getLink_1.default)(req, "next") : null,
            }
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
exports.GetPesananData = GetPesananData;
const createPesanan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const result = yield (0, Pesanan_1.createNewPesanan)(body);
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
exports.createPesanan = createPesanan;
const updateOnePesanan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const id = req.params.id;
        const result = yield (0, Pesanan_1.UpdatePesanan)(body, id);
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
exports.updateOnePesanan = updateOnePesanan;
const deleteOnePesanan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const result = yield (0, Pesanan_1.deletDataPesanan)(id);
        return res.status(200).json({
            msg: "delete sucses",
            pesan: result.rows
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
exports.deleteOnePesanan = deleteOnePesanan;
