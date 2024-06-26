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
exports.GetUserImg = exports.login = exports.register = exports.deleteOneUser = exports.createNewUser = exports.updateUsers = exports.getUsers = void 0;
const users_1 = require("../repositories/users");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authorization_1 = require("../middlewares/authorization");
const getLink_1 = __importDefault(require("../helpers/getLink"));
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullname, page, limit, id } = req.query;
        const result = yield (0, users_1.getAllUsers)(fullname, limit, page);
        if (result.rows.length === 0) {
            return res.status(404).json({
                msg: 'data tak ditemukan',
                data: [],
            });
        }
        //mendaptkan total pesanan
        const TotdataUser = yield (0, users_1.getTotalUser)(id);
        //mendapatkan value page untuk di oper ke response
        const pageUser = parseInt(page || '1');
        //mendapatkan jumlah total pesanan 
        const totalData = TotdataUser.rows[0].total_user;
        //mendapatkan data total page
        const totalPage = Math.ceil(totalData / (limit || 3)); // assign default limit 3 karna error "limit possible to undefined"
        return res.status(200).json({
            msg: "sucses",
            data: result.rows,
            meta: {
                totalData,
                totalPage,
                pageUser,
                prevLink: pageUser > 1 ? (0, getLink_1.default)(req, "previous") : null,
                nextLink: pageUser != totalPage ? (0, getLink_1.default)(req, "next") : null,
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
exports.getUsers = getUsers;
const updateUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { file } = req;
        const id = req.params.id;
        const body = req.body;
        const { password } = req.body;
        let hashed;
        if (password) {
            const salt = yield bcrypt_1.default.genSalt();
            hashed = yield bcrypt_1.default.hash(password, salt);
        }
        let result = yield (0, users_1.updateOneUsers)(body, id, hashed, file === null || file === void 0 ? void 0 : file.filename);
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
exports.updateUsers = updateUsers;
const createNewUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const result = yield (0, users_1.createUser)(body);
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
exports.createNewUser = createNewUser;
const deleteOneUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const result = yield (0, users_1.deleteUser)(id);
        return res.status(200).json({
            msg: "delete sucses",
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
exports.deleteOneUser = deleteOneUser;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = req.body;
    const { file } = req;
    try {
        //make hash pass
        const salt = yield bcrypt_1.default.genSalt();
        const hashed = yield bcrypt_1.default.hash(password, salt);
        //simpan keadalam db
        const result = yield (0, users_1.registerUser)(req.body, hashed, file === null || file === void 0 ? void 0 : file.filename);
        if (result.rowCount !== 1) {
            return res.status(404).json({
                msg: 'gagal register, isi data dengan benar',
                data: [],
            });
        }
        return res.status(200).json({
            msg: "register sucses",
            data: result
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
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const checkUser = yield (0, users_1.loginUser)(email);
        //error handling jika no user
        if (!checkUser.rows.length)
            throw new Error('No user has found.');
        console.log(checkUser.rows[0].role);
        //jika ditemukan usernya
        const { password: hashedPwd, fullname, role } = checkUser.rows[0];
        const checkPass = yield bcrypt_1.default.compare(password, hashedPwd);
        //error handling jika no pass match
        if (!checkPass)
            throw new Error('login gagal');
        //jika cocok maka beri payload
        const payload = {
            email,
            role
        };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, authorization_1.jwtOptions);
        return res.status(200).json({
            msg: "selamat datang, " + fullname,
            data: [{ token }]
        });
    }
    catch (error) {
        if (error instanceof Error) {
            if (/(invalid(.)+uuid(.)+)/g.test(error.message)) {
                return res.status(401).json({
                    msg: "Error",
                    err: "Siswa tidak ditemukan",
                });
            }
            return res.status(401).json({
                msg: "Error",
                err: error.message,
            });
        }
        return res.status(500).json({
            msg: "Error",
            err: "Internal Server Error",
        });
    }
});
exports.login = login;
const GetUserImg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { file } = req;
        const result = yield (0, users_1.setImgUsers)(req.params.email, file === null || file === void 0 ? void 0 : file.filename);
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
exports.GetUserImg = GetUserImg;
