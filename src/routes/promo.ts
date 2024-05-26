import { Router } from "express";
import { CreateNewPromo, deleteOnePromo, getPromo, UpdatePromo } from "../controllers/promo";

const promoRouter = Router();

promoRouter.get("/", getPromo);

promoRouter.post("/", CreateNewPromo);

promoRouter.put("/:id", UpdatePromo);

promoRouter.delete("/:id", deleteOnePromo)

export default promoRouter;