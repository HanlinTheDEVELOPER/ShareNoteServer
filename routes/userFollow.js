import express from "express";

import * as UserFollowController from "../controllers/userFollow.js";
import isAuthenticate from "../middlewares/isAuthenticate.js";
const UserFollowRouter = express.Router();

UserFollowRouter.post("/", isAuthenticate, UserFollowController.follow);
UserFollowRouter.post(
  "/unfollow",
  isAuthenticate,
  UserFollowController.unfollow
);

export default UserFollowRouter;
