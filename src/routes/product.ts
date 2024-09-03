import { Router } from "express";
import { getProduct, getDetailProduct, createNewProduct, UpdateOneProduct, deleteProductrow, UploadProductImg, getOrderRelation } from "../controllers/product"; 
import {  singleCloudUploader } from "../middlewares/upload";
import { authorization } from "../middlewares/authorization";
import { createOrderRelation } from "../controllers/product";

// import { product } from '../models/product';

const productrouter = Router();

productrouter.get("/",getProduct)

productrouter.get("/:id", getDetailProduct) 

productrouter.post("/create",  authorization(['admin']), singleCloudUploader("image") , createNewProduct);

productrouter.patch("/:id", authorization(['admin']), singleCloudUploader("image") , UpdateOneProduct);

productrouter.delete("/:id", deleteProductrow);

productrouter.post("/pesanan", createOrderRelation);

productrouter.get("/pesanan/:idOrder", getOrderRelation);

export default productrouter;