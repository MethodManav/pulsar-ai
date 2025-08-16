import jwt from "jsonwebtoken";
import { config } from "./Config";

const JWT_SECRET = config.JWT_SECRET ?? "your_jwt_secret";

export const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "1h" });
};

export const verifyToken = (token: string): jwt.JwtPayload | null => {
  try {
    const data = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    console.log("Decoded JWT:", data);
    return data;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
};
