import { Router } from "express";
import productrouter  from "./product";
import usersRouter from "./users";
import promoRouter from "./promo";
import pesananRouter from "./pesanan";


const mainrouter = Router();

mainrouter.use("/product", productrouter);

mainrouter.use("/users", usersRouter);

mainrouter.use("/promo", promoRouter);

mainrouter.use("/pesanan", pesananRouter)

export default mainrouter;


 
