import { Router } from "express";
import { createNewUser, getUsers, deleteOneUser ,updateUsers, register, login, GetUserImg} from "../controllers/users";
import { authorization } from "../middlewares/authorization";
import { singleUpdloader } from "../middlewares/upload";

const usersRouter = Router(); 

usersRouter.get("/",authorization() ,getUsers );

usersRouter.post("/", createNewUser);

usersRouter.put("/:id", updateUsers);

usersRouter.delete("/:id", deleteOneUser);

usersRouter.post("/register", singleUpdloader("image"), register);

usersRouter.post("/login", login);

usersRouter.patch("/:email/userImage",singleUpdloader("userImage") , GetUserImg  )

export default usersRouter;