import { App } from "@slack/bolt";
import { config } from "../utiles/Config";
import { Request, Response } from "express";
import UserModel from "../model/UserModel";
import RepoChannelModel from "../model/RepoChannelModel";

export class SlackController {
  getAllChannels = async (req: Request, res: Response) => {
    try {
      //fetch user slack bot token
      const userDetails = await UserModel.findById(req.user.id);
      const SlackApp = new App({
        signingSecret: config.SLACK_SIGNING_SECRET,
        token: userDetails?.slack?.access_token,
      });
      const channelsResponse = await SlackApp.client.conversations.list();
      const channelList = (channelsResponse.channels ?? []).map(
        (channel: any) => ({
          id: channel.id,
          name: channel.name,
        })
      );

      if (channelList.length > 0) {
        res.json(channelList);
      } else {
        res.status(404).json({ error: "Channels not found" });
      }
    } catch (error) {
      console.error("Error fetching channels:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  getUserConnectedChannel = async (req: Request, res: Response) => {
    try {
      const userChannelList = await RepoChannelModel.find({
        userId: req.user.id,
      });
      if (userChannelList) {
        return res.status(200).json({
          channels: userChannelList,
          message: "User connected channels fetched successfully",
        });
      } else {
        return res.status(404).json({ error: "Channel not found" });
      }
    } catch (error) {
      console.error("Error fetching channel info:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
}
