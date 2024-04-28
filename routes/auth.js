import express from "express";
import passport from "passport";

import * as AuthController from "../controllers/auth.js";
import isAuthenticate from "../middlewares/isAuthenticate.js";

const authRouter = express.Router();

authRouter.get("/google", (req, res, next) => {
  const { sm } = req.query;
  const state = sm ? sm : undefined;
  const authenticator = passport.authenticate("google", {
    scope: ["profile", "email"],
    state,
  });
  authenticator(req, res, next);
});

authRouter.get(
  "/0auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
  (req, res) => {
    const { state } = req.query;
    res.redirect(
      process.env.ALLOW_ORIGIN +
        "/login/?user=" +
        btoa(req.user._id) +
        "&state=" +
        state
    );
  }
);

authRouter.get("/login", AuthController.login);
authRouter.get("/status", isAuthenticate, AuthController.checkIsLogin);
authRouter.get("/logout", isAuthenticate, AuthController.logout);
authRouter.get("/logoutall", isAuthenticate, AuthController.logoutOfAllDevices);

export default authRouter;
