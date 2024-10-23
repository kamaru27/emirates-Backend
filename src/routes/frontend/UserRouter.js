    import express from "express";
import { createUser, userLogin, userUpdate, } from "../../controllers/frontend/UserController.js";
import { userAuthMiddleware } from "../../middleware/UserAuthMiddleware.js";

export const userRouter = express.Router();

userRouter.post("/", createUser);

userRouter.post("/login", userLogin);

userRouter.post("/userUpdate", userAuthMiddleware, userUpdate);
