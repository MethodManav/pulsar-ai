import { Request, Response } from "express";
import { AuthFactory } from "../utiles/oauth/AuthFactory";
import UserModel from "../model/UserModel";
import { generateToken, verifyToken } from "../utiles/Helper";

export class AuthController {
  async authorizeProvider(req: Request, res: Response) {
    const { provider } = req.query;
    if (!provider) {
      return res.status(400).json({ error: "Provider is required" });
    }
    try {
      const authClient = AuthFactory.createOAuthClient(provider as string);
      const authorizationUrl = authClient.getAuthorizationUrl();
      return res.status(200).json({ url: authorizationUrl });
    } catch (error) {
      console.error("Error during authorization:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async handleProviderCallback(req: Request, res: Response) {
    const { provider, code, state } = req.query;
    if (!provider) {
      return res.status(400).json({ error: "Provider is required" });
    }
    try {
      const authClient = AuthFactory.createOAuthClient(provider as string);
      //Exchange Code for access token
      const token = await authClient.exchangeCodeForToken(
        code as string,
        state as string
      );
      // Fetch User Details
      if (!token) {
        return res.status(400).json({ error: "Invalid code" });
      }
      if (provider == "github") {
        const userDetails = await authClient.getUserDetails(
          token.github?.access_token as string
        );
        if (!userDetails) {
          return res
            .status(400)
            .json({ error: "Failed to fetch user details" });
        }
        const username = userDetails.login || userDetails.username || "";
        const isExistingUser = await UserModel.findOne({ username });
        if (isExistingUser) {
          const jwtToken = generateToken(isExistingUser._id.toString());
          return res.status(200).json({ access_Token: jwtToken });
        }
        const newUser = await UserModel.create({
          username: userDetails.login || "",
          name: userDetails.name || "",
          github: {
            access_token: token.github?.access_token as string,
            installation_id: (req.query.installation_id as string) || null,
            refresh_token: token.github?.refresh_token as string,
            expires_in: token.github?.expires_in as number,
            updatedAt: new Date(),
            connected: false,
          },
        });
        const jwtToken = generateToken(newUser._id.toString());
        return res.status(200).json({ access_Token: jwtToken });
      } else {
        let userDetails = verifyToken(req.headers["x-auth-token"] as string);
        if (!userDetails) {
          return res.status(400).json({ error: "Invalid user details" });
        }
        userDetails = await UserModel.findByIdAndUpdate(
          {
            _id: userDetails.id,
          },
          {
            $set: {
              slack: {
                access_token: token.slack?.access_token as string,
                token_type: token.slack?.token_type as string,
                scope: token.slack?.scope as string,
                bot_user_id: token.slack?.bot_user_id as string,
                team: {
                  id: token.slack?.team?.id as string,
                  name: token.slack?.team?.name as string,
                },
                authed_user: {
                  id: token.slack?.authed_user?.id as string,
                },
                updatedAt: new Date(),
                connected: true,
              },
            },
          }
        );
      }
      res.status(200).json({
        message: "Authentication Done successful",
      });
    } catch (error) {
      console.error("Error during callback handling:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
