import { Router } from "express";
import { createPesanan, deleteOnePesanan, GetPesananData, updateOnePesanan, GetPesananDataByUser } from "../controllers/pesanan";

const pesananRouter = Router();

pesananRouter.get("/:id", GetPesananData);

pesananRouter.post("/", createPesanan);

pesananRouter.put("/:id", updateOnePesanan);

pesananRouter.delete("/:id", deleteOnePesanan );

pesananRouter.get("/user/:id", GetPesananDataByUser);


export default  pesananRouter;
