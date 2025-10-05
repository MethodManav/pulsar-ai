import UserModel from "../model/UserModel";
import { config } from "../utiles/Config";
import githubConfig from "../utiles/integration/Github/GithubConfig";
import { Request, Response } from "express";
export class GithubAppController {
  async getInstallationUrl(req: Request, res: Response) {
    try {
      const { installationUrl } = githubConfig;
      return res.status(200).json({ url: installationUrl });
    } catch (err) {
      console.error("Error installing GitHub app:", err);
    }
    res.status(500).json({ message: "Internal server error" });
  }
  async setInstallationUrl(req: Request, res: Response) {
    try {
      const { installation_id, code } = req.query;
      if (!installation_id) {
        return res.status(400).json({ message: "Missing installation_id" });
      }
      //fetch user
      const isExisting = await UserModel.findById(req.user?.id);
      if (!isExisting) {
        return res.status(404).json({ message: "User not found" });
      }
      const userInfo = await GithubAppController.getUserInfoFromInstallation(
        code as string
      );
      const updateUser = await UserModel.findByIdAndUpdate(
        req.user?.id,
        {
          $set: {
            "github.installation_id": installation_id,
            "github.access_token": userInfo.access_token,
            "github.connected": true,
          },
        },
        { new: true }
      );
      if (!updateUser) {
        return res.status(404).json({ message: "User not found" });
      }
      return res
        .status(200)
        .json({ message: "Installation ID set successfully" });
    } catch (err) {
      console.error("Error getting installation URL:", err);
    }
  }
  static async getUserInfoFromInstallation(code: string): Promise<any> {
    try {
      const { tokenUrl } = githubConfig;
      const clientId = config.GITHUB_INSTALLATION_CLIENT_ID;
      const clientSecret = config.GITHUB_INSTALLATION_SECRET;
      const response = await fetch(
        `${tokenUrl}?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(response.statusText || "Failed to fetch user info");
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Error fetching user info:", err);
      throw new Error("Failed to fetch user info");
    }
  }
}
