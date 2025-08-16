import { App } from "@slack/bolt";
import { config } from "../utiles/Config";
import { Request, Response } from "express";
import UserModel from "../model/UserModel";

export class SlackController {
  getAllChannels = async (req: Request, res: Response) => {
    try {
      //fetch user slack bot token
      const userDetails = await UserModel.findById(req.user.id);
      const SlackApp = new App({
        signingSecret: config.SLACK_SIGNING_SECRET,
        token: userDetails?.slack?.access_token,
      });
      const channels = await SlackApp.client.conversations.list();
      if (channels) {
        res.json(channels);
      } else {
        res.status(404).json({ error: "Channels not found" });
      }
    } catch (error) {
      console.error("Error fetching channels:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
}
