import { Router } from "express";
import { getProduct, getDetailProduct, createNewProduct, UpdateOneProduct, deleteProductrow, UploadProductImg } from "../controllers/product"; 
import { multiFieldUploader, singleUpdloader } from "../middlewares/upload";
import { authorization } from "../middlewares/authorization";

// import { product } from '../models/product';

const productrouter = Router();

productrouter.get("/",getProduct)

productrouter.get("/:id", getDetailProduct) 

productrouter.post("/create",  authorization(['admin']),singleUpdloader("image") , createNewProduct);

productrouter.patch("/:id", authorization(['admin']), singleUpdloader("image") , UpdateOneProduct);

productrouter.delete("/:id", deleteProductrow);



export default productrouter;