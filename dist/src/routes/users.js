"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = require("../controllers/users");
const authorization_1 = require("../middlewares/authorization");
const upload_1 = require("../middlewares/upload");
const usersRouter = (0, express_1.Router)();
usersRouter.get("/", (0, authorization_1.authorization)(['admin']), users_1.getUsers);
usersRouter.post("/", (0, authorization_1.authorization)(['admin']), users_1.createNewUser);
usersRouter.put("/:id", (0, authorization_1.authorization)(['admin']), (0, upload_1.singleUpdloader)("image"), users_1.updateUsers);
usersRouter.delete("/:id", (0, authorization_1.authorization)(['admin']), users_1.deleteOneUser);
usersRouter.post("/register", (0, upload_1.singleUpdloader)("image"), users_1.register);
usersRouter.post("/login", users_1.login);
// usersRouter.patch("/:email/userImage",singleUpdloader("userImage") , GetUserImg  )
exports.default = usersRouter;
