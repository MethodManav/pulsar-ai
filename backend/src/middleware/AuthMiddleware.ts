import { Request, Response, NextFunction } from "express";
import { decodeToken, generateToken, verifyToken } from "../utiles/Helper";
import UserModel from "../model/UserModel";
import { GithubClient } from "../utiles/integration/Github/GithubClient";
import { getConfigByProvider } from "../utiles/Config";
export class AuthMiddleware {
  static isAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.user) {
      return next();
    }
    res.status(401).send("Unauthorized");
  }
  static isValidateJWT(req: Request, res: Response, next: NextFunction) {
    const token = req.headers["x-auth-token"] as string;
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    const verifyJWT = verifyToken(token);
    if (!verifyJWT) {
      const decodeJwt = decodeToken(token);
      // refresh token
      if (decodeJwt) {
        const newToken = generateToken(decodeJwt.id);
        return res.status(200).json({ refreshToken: newToken });
      }
      return res.status(401).json({ message: "Invalid token" });
    }
    if (!req.user) {
      req.user = {} as any;
    }

    req.user = { id: verifyJWT.id };
    next();
  }
  static async isGithubAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      // Fetch user from DB
      const userDetails = await UserModel.findById(userId).exec();
      if (!userDetails || !userDetails.github) {
        return res.status(401).json({ error: "GitHub not connected" });
      }

      let { refresh_token, expires_in, updatedAt } = userDetails.github;

      const tokenCreatedAt = updatedAt?.getTime() || 0;
      const expiryTime = tokenCreatedAt + expires_in * 1000;

      const now = Date.now();
      if (now >= expiryTime) {
        // Token expired, refresh it
        const githubConfig = getConfigByProvider("github");
        const githubClient = new GithubClient(
          githubConfig.clientId,
          githubConfig.clientSecret
        );
        await githubClient.refreshGitHubToken(refresh_token, userId);
        next();
      }
      next();
    } catch (error: any) {
      console.error("GitHub Auth Middleware Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
