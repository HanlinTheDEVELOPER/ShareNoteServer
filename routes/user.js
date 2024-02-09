import express from "express";
import * as UserController from "../controllers/user.js";
import isAuthenticate from "../middlewares/isAuthenticate.js";

const userRouter = express.Router();

userRouter.get("/me", isAuthenticate, UserController.getMe);
userRouter.get("/:userId/notes", isAuthenticate, UserController.getNotesByMe);
userRouter.get(
  "/:userId/receives",
  isAuthenticate,
  UserController.getNotesToMe
);

export default userRouter;
