import passport from "passport";
import GoogleStrategy from "passport-google-oauth2";
import { login } from "../controllers/auth.js";
import { response } from "express";
import User from "../models/user.js";
import generateUniqueSlug from "../lib/generateSlugFromName.js";

export default passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.REDIRECT_URL,
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      const { displayName, email, picture } = profile;
      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          name: displayName,
          slug: await generateUniqueSlug(displayName),
          email,
          avatar: picture,
        });
      }
      done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
