import { Request, Response } from "express";
import { AuthFactory } from "../utiles/oauth/AuthFactory";

export class AuthController {
  async authorizeProvider(req: Request, res: Response) {
    const { provider } = req.query;
    if (!provider) {
      return res.status(400).json({ error: "Provider is required" });
    }
    try {
      const authClient = AuthFactory.createOAuthClient(provider as string);
      const authorizationUrl = authClient.getAuthorizationUrl();
      return res.redirect(authorizationUrl);
    } catch (error) {
      console.error("Error during authorization:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
