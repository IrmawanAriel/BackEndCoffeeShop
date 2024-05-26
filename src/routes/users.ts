import { Router } from "express";
import { createNewUser, getUsers, deleteOneUser ,updateUsers, register, login} from "../controllers/users";

const usersRouter = Router(); 

usersRouter.get("/",getUsers );

usersRouter.post("/", createNewUser);

usersRouter.put("/:id", updateUsers);

usersRouter.delete("/:id", deleteOneUser);

usersRouter.post("/register", register);

usersRouter.post("/login", login);

export default usersRouter;