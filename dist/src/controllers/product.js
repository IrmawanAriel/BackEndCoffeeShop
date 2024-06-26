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
exports.UploadProductImg = exports.deleteProductrow = exports.UpdateOneProduct = exports.createNewProduct = exports.getDetailProduct = exports.getProduct = void 0;
const product_1 = require("../repositories/product");
const getLink_1 = __importDefault(require("../helpers/getLink"));
const getProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, product_1.getAllProduct)(req.query);
        console.log(result.rows[0]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                msg: 'data tak ditemukan',
                data: [],
            });
        }
        //mendaptkan total product
        const TotdataProduct = yield (0, product_1.getTotalProduct)(req.query);
        //mendapatkan value page untuk di oper ke response
        const page = parseInt(req.query.page) || 1;
        //mendapatkan jumlah total product 
        const totalData = parseInt(TotdataProduct.rows[0].total_product);
        //mendapatkan data total page
        const totalPage = Math.ceil(totalData / (parseInt(req.query.limit || '3'))); // assign default limit 3 karna error "limit possible to undefined"
        return res.status(200).json({
            msg: "sucses",
            data: result.rows,
            meta: {
                totalData,
                totalPage,
                page,
                prevLink: page > 1 ? (0, getLink_1.default)(req, "previous") : null,
                nextLink: page != totalPage ? (0, getLink_1.default)(req, "next") : null,
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
exports.getProduct = getProduct;
const getDetailProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, product_1.GetOneProduct)(req.params.nama_produk);
        if (result.rows.length === 0) {
            return res.status(404).json({
                msg: 'data tak ditemukan',
                data: [],
            });
        }
        return res.status(200).json({
            msg: 'succes',
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
exports.getDetailProduct = getDetailProduct;
const createNewProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { file } = req;
    // console.log(req.body);
    if (!file)
        return res.status(400).json({
            msg: "file tidak ada",
            err: "masukan file berjenis JPG dsb",
        });
    try {
        const result = yield (0, product_1.createProduct)(req.body, file.filename);
        return res.status(201).json({
            msg: "success",
            data: result.rows,
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
exports.createNewProduct = createNewProduct;
const UpdateOneProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { file } = req;
        const id = req.params.id;
        const result = yield (0, product_1.UpdateProduct)(id, req.body, file === null || file === void 0 ? void 0 : file.filename);
        if (result.rows.length === 0) {
            return res.status(404).json({
                msg: 'data tak ditemukan',
                data: [],
            });
        }
        return res.status(200).json({
            msg: 'upadate succed',
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
exports.UpdateOneProduct = UpdateOneProduct;
const deleteProductrow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const result = yield (0, product_1.deleteProduct)(id);
        return res.status(200).json({
            msg: "delete succes",
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
exports.deleteProductrow = deleteProductrow;
const UploadProductImg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { file } = req;
        const id = parseInt(req.params.id);
        const result = yield (0, product_1.getProdImg)(id, file === null || file === void 0 ? void 0 : file.filename);
        return res.status(200).json({
            msg: "Gambar berhasil ditambahkan",
            data: result.rows,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            if (/(invalid(.)+uuid(.)+)/g.test(error.message)) {
                return res.status(401).json({
                    msg: "Error",
                    err: "User tidak ditemukan",
                });
            }
            console.log(error.message);
        }
        return res.status(500).json({
            msg: "Error",
            err: "Internal Server Error",
        });
    }
});
exports.UploadProductImg = UploadProductImg;
