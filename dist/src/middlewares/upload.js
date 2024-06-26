"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiFieldUploader = exports.multiUploader = exports.singleUpdloader = void 0;
const multer_1 = __importStar(require("multer"));
const path_1 = __importDefault(require("path"));
const multerDisk = (0, multer_1.diskStorage)({
    destination: (req, file, cb) => {
        cb(null, "./public/imgs"); // return path untuk menyimpan
    },
    filename: (req, file, cb) => {
        // misal: image-timestamp.{jpg|png|jpeg}
        const extName = path_1.default.extname(file.originalname); // mengambil tipe extention filenya
        const newFileName = `image-${Date.now()}${extName}`; // generate nama file baru
        cb(null, newFileName); //mereturn filename
    },
});
const multerOptions = {
    storage: multerDisk,
    limits: {
        fileSize: 1e6, // 1000000
    },
    fileFilter: (req, file, cb) => {
        // const allowedExt = ["jpg", "png", "jpeg"];
        const allowedExtRe = /jpg|png|jpeg/gi;
        const extName = path_1.default.extname(file.originalname);
        // if (!allowedExt.includes(extName.toLowerCase())) return cb(null, false);
        if (!allowedExtRe.test(extName))
            return cb(new Error("Incorrect File"));
        cb(null, true);
    },
};
const uploader = (0, multer_1.default)(multerOptions);
const singleUpdloader = (fieldName) => uploader.single(fieldName);
exports.singleUpdloader = singleUpdloader;
const multiUploader = (fieldName, maxCount) => uploader.array(fieldName, maxCount);
exports.multiUploader = multiUploader;
const multiFieldUploader = (fieldConfig) => uploader.fields(fieldConfig);
exports.multiFieldUploader = multiFieldUploader;
// export const singleUpdloader = (fieldName: string) => (req: Request<AppParams> , res: Response<AppParams>, next: NextFunction) => {
//   const uploaders = uploader.single(fieldName);
//     uploaders( req,res, (err) => {
//       if (err instanceof Error) {
//         return res.status(400).json({
//           msg: "Bad Request",
//           err: err.message,
//         });
//       }
//     })
//   next()
// }
