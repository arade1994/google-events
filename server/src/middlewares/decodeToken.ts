import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const decodeToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.jwt;

  try {
    const decodedJwt = jwt.verify(token, process.env.JWT_SECRET || "");
    req.user = decodedJwt;
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }

  next();
};
