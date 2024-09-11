import { Router } from "express";
import { createNewUser, getUsers, deleteOneUser ,updateUsers, register, login, GetUserImg, UserById} from "../controllers/users";
import { authorization } from "../middlewares/authorization";
import { singleCloudUploader } from "../middlewares/upload";

const usersRouter = Router(); 

usersRouter.get("/", authorization(['admin']), getUsers );

usersRouter.get("/:id", authorization(['user']), UserById );

usersRouter.post("/", authorization(['admin']), createNewUser);

usersRouter.put("/:id", authorization(['user']), singleCloudUploader("image"), updateUsers);

usersRouter.delete("/:id", authorization(['admin']), deleteOneUser);

usersRouter.post("/register", singleCloudUploader("image"), register);

usersRouter.post("/login", login);

// usersRouter.patch("/:email/userImage",singleUpdloader("userImage") , GetUserImg  )

export default usersRouter;