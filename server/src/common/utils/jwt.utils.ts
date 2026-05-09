import jwt from "jsonwebtoken";
import { AppConfig } from "../../config/app.js";

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export const signToken = (payload: TokenPayload) => {
  return jwt.sign(payload, AppConfig.JWT_SECRET, {
    expiresIn: "1d",
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, AppConfig.JWT_SECRET);
};
