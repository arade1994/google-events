import { type Request, type Response, Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { GoogleUser } from "../types/user";
import { requireAuth } from "../middlewares/requireAuth";
import { decodeToken } from "../middlewares/decodeToken";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/calendar.readonly",
    ],
    session: false,
    accessType: "offline",
    prompt: "consent",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req: Request, res: Response) => {
    if (!req.user) return res.redirect("http://localhost:3000/login");

    const user = req.user as GoogleUser;

    const token = jwt.sign(
      {
        id: user.id,
        displayName: user.displayName,
        email: user.emails?.[0]?.value,
      },
      process.env.JWT_SECRET || "",
      { expiresIn: "1h" }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    res.redirect("http://localhost:3000/events");
  }
);

router.get(
  "/current_user",
  requireAuth,
  decodeToken,
  (req: Request, res: Response) => {
    const user = req.user as GoogleUser;
    res.json(user);
  }
);

router.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("jwt");
  res.json({ message: "Logged out" });
});

export default router;
