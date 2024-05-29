import { Router } from "express";
import { getProduct, getDetailProduct, createNewProduct, UpdateOneProduct, deleteProductrow, UploadProductImg } from "../controllers/product"; 
import { singleUpdloader } from "../middlewares/upload";

// import { product } from '../models/product';

const productrouter = Router();

productrouter.get("/",getProduct)

productrouter.get("/:nama_produk", getDetailProduct) 

productrouter.post("/", createNewProduct);

productrouter.put("/:id", UpdateOneProduct);

productrouter.delete("/:id", deleteProductrow);

productrouter.patch("/:id/ProductImage", singleUpdloader("ProductImage") , UploadProductImg )

export default productrouter;