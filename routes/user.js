import express from "express";
import * as UserController from "../controllers/user.js";
import isAuthenticate from "../middlewares/isAuthenticate.js";
import multer from "multer";

const userRouter = express.Router();
const upload = multer();

userRouter.get("/me", isAuthenticate, UserController.getMe);
userRouter.get("/:userId/notes", isAuthenticate, UserController.getNotesByMe);
userRouter.get(
  "/:userId/receives",
  isAuthenticate,
  UserController.getNotesToMe
);

userRouter.post(
  "/updateProfile",
  isAuthenticate,
  upload.single("avatar"),
  UserController.updateProfile
);

userRouter.post("/setup", isAuthenticate, UserController.updateTagsAndUserName);
userRouter.get("/profile", UserController.getProfile);
userRouter.post(
  "/changeUsername",
  isAuthenticate,
  UserController.changeUsername
);
userRouter.post("/updateTags", isAuthenticate, UserController.updateTags);

export default userRouter;
