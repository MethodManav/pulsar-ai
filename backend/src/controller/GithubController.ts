// controllers/GithubController.ts
import { Request, Response } from "express";
import { App } from "@slack/bolt";
import { config } from "../utiles/Config";
import RepoChannelModel from "../model/RepoChannelModel";
import UserModel from "../model/UserModel";
import axios from "axios";
import githubConfig from "../utiles/integration/Github/GithubConfig";

export class GithubController {
  private slackClient: App;

  constructor() {
    this.slackClient = new App({
      token: config.SLACK_BOT_TOKEN,
      signingSecret: config.SLACK_SIGNING_SECRET,
    });
  }

  async webhookEventHandler(req: Request, res: Response) {
    try {
      const payload = req.body;

      if (!payload.deployment_status) {
        return res.status(200).send("No deployment_status");
      }

      const state = payload.deployment_status.state;

      // Only act on completed states
      if (!["success", "failure"].includes(state)) {
        console.log(`Ignoring deployment state: ${state}`);
        return res.status(200).send("Ignored state");
      }

      const repo = payload.repository.id;
      console.log("Repository ID:", repo);

      // Fetch channel(s) for this repo from DB
      const repoChannels = await RepoChannelModel.aggregate([
        { $match: { repoName: String(repo) } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $project: {
            _id: 1,
            slackChannelId: 1,
            "user.slack.access_token": 1,
          },
        },
      ]);
      console.log("Repo Channels:", repoChannels);

      if (!repoChannels.length) {
        console.log(`No Slack channels configured for repo:`);
        return res.status(200).send("No channels");
      }

      // Send message to each channel
      for (const rc of repoChannels) {
        const message =
          state === "success"
            ? `✅ Build succeeded for *${payload.repository.name}*`
            : `❌ Build failed for *${payload.repository.name}*`;

        try {
          const slackClient = new App({
            token: rc.user.slack.access_token,
            signingSecret: config.SLACK_SIGNING_SECRET,
          });

          await slackClient.client.chat.postMessage({
            channel: rc.slackChannelId,
            text: message,
          });

          console.log(`Slack message sent to ${rc.slackChannelId}:`, message);
        } catch (err) {
          console.error(`Slack error for channel ${rc.slackChannelId}:`, err);
        }
      }

      res.status(200).send("ok");
    } catch (err) {
      console.error("Error handling webhook:", err);
      res.status(500).send("error");
    }
  }

  async getAllUserRepos(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const user = await UserModel.findById(userId);
      const response = await axios.get("https://api.github.com/user/repos", {
        headers: {
          Authorization: `token ${user?.github?.access_token}`,
          Accept: "application/vnd.github.v3+json",
        },
        params: {
          per_page: 100,
          sort: "updated",
        },
      });
      const repos = response.data.map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        private: repo.private,
      }));

      res.status(200).json(repos);
    } catch (err) {
      console.error("Error fetching user repos:", err);
      res.status(500).send("error");
    }
  }

  async connectRepoChannel(req: Request, res: Response) {
    const { repoName, slackChannelId } = req.body;
    console.log("Connect Repo Payload:", req.body);
    if (!repoName || !slackChannelId) {
      return res
        .status(400)
        .json({ message: "Missing repoName or slackChannelId" });
    }

    try {
      // Check if the repo is already connected
      const existing = await RepoChannelModel.findOne({
        repos: {
          id: repoName, //
        },
        slackChannels: {
          id: slackChannelId,
        },
      });
      if (existing) {
        return res
          .status(400)
          .json({ message: "Repo is already connected to this channel" });
      }

      // Create a new connection
      const newConnection = new RepoChannelModel({
        repoName,
        slackChannelId,
        userId: req.user?.id,
      });
      await newConnection.save();
      //fetch user slack token
      const user = await UserModel.findById(req.user?.id);
      //send greeting to channel
      const slackClient = new App({
        token: user?.slack?.access_token,
        signingSecret: config.SLACK_SIGNING_SECRET,
      });
      // auto join channel
      await slackClient.client.conversations.join({ channel: slackChannelId });
      await slackClient.client.chat.postMessage({
        channel: newConnection.slackChannels.id,
        text: `:tada: Hello <!channel>! The repository has been successfully connected. 🎉\nGet ready to stay updated on all changes and notifications!`,
      });
      res.status(201).json({
        message: "Repo connected to Slack channel",
      });
    } catch (err) {
      console.error("Error connecting repo to channel:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
