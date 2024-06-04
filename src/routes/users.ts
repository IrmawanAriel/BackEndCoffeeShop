import { Router } from "express";
import { createNewUser, getUsers, deleteOneUser ,updateUsers, register, login, GetUserImg} from "../controllers/users";
import { authorization } from "../middlewares/authorization";
import { singleUpdloader } from "../middlewares/upload";

const usersRouter = Router(); 

usersRouter.get("/", authorization(['admin']), getUsers );

usersRouter.post("/", authorization(['admin']), createNewUser);

usersRouter.put("/:id", authorization(['admin']), singleUpdloader("image"), updateUsers);

usersRouter.delete("/:id", authorization(['admin']), deleteOneUser);

usersRouter.post("/register", singleUpdloader("image"), register);

usersRouter.post("/login", login);

// usersRouter.patch("/:email/userImage",singleUpdloader("userImage") , GetUserImg  )

export default usersRouter;