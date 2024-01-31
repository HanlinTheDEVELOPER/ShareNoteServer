import express from "express";
import * as UserController from "../controllers/user.js";
import isAuthorize from "../middlewares/isAuthorize.js";
import isAuthenticate from "../middlewares/isAuthenticate.js";

const userRouter = express.Router();

userRouter.get("/me", isAuthenticate, UserController.getMe);

export default userRouter;
