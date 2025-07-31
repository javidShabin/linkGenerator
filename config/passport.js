import dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userModel from "../models/userModel.js"; // adjust the path

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/v1/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await userModel.findOne({ email: profile.emails[0].value });

        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = await userModel.create({
          userName: profile.displayName,
          email: profile.emails[0].value,
          password: "GoogleAuthUser", // optional placeholder
          phone: "0000000000",        // optional placeholder
          profileImg: profile.photos[0].value,
          role: "user",
        });

        return done(null, newUser);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

export default passport;
