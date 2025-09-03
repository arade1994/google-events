import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth";
import eventsRouter from "./routes/events";
import { encrypt } from "./utils/tokens";
import { json } from "body-parser";
import { userRepo } from "./repositories";

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
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await userRepo().findOneBy({ googleId: profile.id });

        if (!user) {
          user = userRepo().create({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails?.[0]?.value || "",
          });
          await userRepo().save(user);
        }

        user.accessToken = encrypt(accessToken);
        user.refreshToken = encrypt(refreshToken);

        await userRepo().save(user);

        return done(null, user);
      } catch (err) {
        return done(err, undefined);
      }
    }
  )
);

export default app;
