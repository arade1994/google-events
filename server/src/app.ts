import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import cookieParser from "cookie-parser";
import cors from "cors";
import { GoogleUser } from "./types/user";
import authRouter from "./routes/auth";

dotenv.config();

const app = express();

app.use(cookieParser());
app.set("trust proxy", true);
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(passport.initialize());

app.use("/auth", authRouter);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: "http://localhost:4000/auth/google/callback",
    },
    (accessToken, refreshToken, profile: Profile, done) => {
      const user: GoogleUser = {
        id: profile.id,
        displayName: profile.displayName,
        emails: profile.emails?.map((e) => ({ value: e.value })) || [],
      };

      return done(null, user);
    }
  )
);

app.use(passport.initialize());

export default app;
