import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth";
import eventsRouter from "./routes/events";
import { AppDataSource } from "./data-source";
import { User } from "./entities/User";
import { encrypt } from "./utils/tokens";
import { json } from "body-parser";

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
app.use(json());

app.use(passport.initialize());

app.use("/auth", authRouter);
app.use("/events", eventsRouter);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: "http://localhost:4000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userRepo = AppDataSource.getRepository(User);

        let user = await userRepo.findOneBy({ googleId: profile.id });

        if (!user) {
          user = userRepo.create({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails?.[0]?.value || "",
          });
          await userRepo.save(user);
        }

        user.accessToken = encrypt(accessToken);
        user.refreshToken = encrypt(refreshToken);

        await userRepo.save(user);

        return done(null, user);
      } catch (err) {
        return done(err, undefined);
      }
    }
  )
);

export default app;
