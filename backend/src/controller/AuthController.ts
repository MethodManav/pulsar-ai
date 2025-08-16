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
      console.log("Token received:", token);
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
        await UserModel.findOne({ username });
        const newUser = await UserModel.create({
          username: userDetails.login || "",
          name: userDetails.name || "",
          github: {
            access_token: token.github?.access_token as string,
            refresh_token: token.github?.refresh_token as string,
            expires_in: token.github?.expires_in as number,
            updatedAt: new Date(),
          },
        });
        const jwtToken = generateToken(newUser._id.toString());
        return res.status(200).json({ access_Token: jwtToken });
      } else {
        console.log(req.headers["x-auth-token"] as string);
        let userDetails = verifyToken(req.headers["x-auth-token"] as string);
        console.log("User Details:", userDetails);
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
