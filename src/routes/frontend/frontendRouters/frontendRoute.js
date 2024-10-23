import express from "express";
import { userRouter } from "../../frontend/UserRouter.js";
import { homePageRouter } from "../../frontend/HomeRouter.js";
import { bannerPageRouter } from "../BannerRouter.js";

export const frontendRoutes = express.Router();

frontendRoutes.use('/user', userRouter);

frontendRoutes.use('/home', homePageRouter);

frontendRoutes.use('/banner', bannerPageRouter);
