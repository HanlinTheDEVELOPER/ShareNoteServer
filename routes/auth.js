import express from "express";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth2";
import multer from "multer";

import * as AuthController from "../controllers/auth.js";
import { isAuthenticate } from "../middlewares/isAuthenticate.js";

const authRouter = express.Router();
const upload = multer();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.REDIRECT_URL,
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

authRouter.get(
  "/login",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

authRouter.get(
  "/0auth/google",
  passport.authenticate("google", {
    successRedirect: "/api/v1/auth/success",
    failureRedirect: "/api/v1/auth/failure",
  })
);

authRouter.get("/success", AuthController.login);

authRouter.get("/failure", AuthController.failure);

authRouter.put(
  "/updateProfile",
  isAuthenticate,
  upload.single("avatar"),
  AuthController.updateProfile
);

export default authRouter;
