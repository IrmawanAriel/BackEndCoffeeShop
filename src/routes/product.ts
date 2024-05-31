import { Router } from "express";
import { getProduct, getDetailProduct, createNewProduct, UpdateOneProduct, deleteProductrow, UploadProductImg } from "../controllers/product"; 
import { multiFieldUploader, singleUpdloader } from "../middlewares/upload";

// import { product } from '../models/product';

const productrouter = Router();

productrouter.get("/",getProduct)

productrouter.get("/:nama_produk", getDetailProduct) 

productrouter.post("/create", singleUpdloader("image") , createNewProduct);

productrouter.patch("/:id", singleUpdloader("image") , UpdateOneProduct);

productrouter.delete("/:id", deleteProductrow);

// productrouter.patch("/:id/ProductImage", singleUpdloader("ProductImage") , UploadProductImg )


export default productrouter;