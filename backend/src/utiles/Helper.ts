import jwt from "jsonwebtoken";
import { config } from "./Config";

const JWT_SECRET = config.JWT_SECRET ?? "your_jwt_secret";

export const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "1h" });
};

export const verifyToken = (token: string): jwt.JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
  } catch (error) {
    return null;
  }
};
