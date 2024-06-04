import { Router } from "express";
import { createPesanan, deleteOnePesanan, GetPesananData, updateOnePesanan } from "../controllers/pesanan";

const pesananRouter = Router();

pesananRouter.get("/:id", GetPesananData);

pesananRouter.post("/", createPesanan);

pesananRouter.put("/:id", updateOnePesanan);

pesananRouter.delete("/:id", deleteOnePesanan );


export default  pesananRouter;