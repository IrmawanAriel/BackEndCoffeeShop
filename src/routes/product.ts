import { Router } from "express";
// import { Request, Response } from "express";
import { getProduct, getDetailProduct, createNewProduct, UpdateOneProduct, deleteProductrow } from "../controllers/product"; 

// import { product } from '../models/product';

const productrouter = Router();

productrouter.get("/",getProduct)

productrouter.get("/:nama_produk", getDetailProduct) 

productrouter.post("/", createNewProduct);

productrouter.put("/:id", UpdateOneProduct);

productrouter.delete("/:id", deleteProductrow);

export default productrouter;