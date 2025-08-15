import { Request, Response } from "express";
import { AuthFactory } from "../utiles/oauth/AuthFactory";
import UserModel from "../model/UserModel";

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
    const { provider, code,state } = req.query;
    if (!provider) {
      return res.status(400).json({ error: "Provider is required" });
    }
    try {
      const authClient = AuthFactory.createOAuthClient(provider as string);
      //Exchange Code for access token
      const token = await authClient.exchangeCodeForToken(code as string, state as string);

      // Fetch User Details
      if (!token) {
        return res.status(400).json({ error: "Invalid code" });
      }
      const userDetails = await authClient.getUserDetails(token.access_token);
      if (!userDetails) {
        return res.status(400).json({ error: "Failed to fetch user details" });
      }
      let user = await UserModel.findOne({ email: userDetails.email });
      if (!user) {
        user = new UserModel({
          email: userDetails.email,
          name: userDetails.name,
          [provider as string]: {
            accessToken: token.access_token,
            refreshToken: token.refresh_token,
            expiresIn: token.expires_in,
          },
        });
        await user.save();
      } else {
        await UserModel.updateOne(
          { _id: user._id },
          {
            [provider as string]: {
              accessToken: token.access_token,
              refreshToken: token.refresh_token,
              expiresIn: token.expires_in,
            },
          }
        );
      }
      return res
        .status(200)
        .json({ message: "User authenticated successfully" });
    } catch (error) {
      console.error("Error during callback handling:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
