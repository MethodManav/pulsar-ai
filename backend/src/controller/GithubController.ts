// controllers/GithubController.ts
import { Request, Response } from "express";
import { App } from "@slack/bolt";
import { config } from "../utiles/Config";
import RepoChannelModel from "../model/RepoChannelModel";
import UserModel from "../model/UserModel";
import axios from "axios";

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

      if (!payload.workflow_run) return res.status(200).send("No workflow_run");

      const repo = payload.repository.full_name;
      const conclusion = payload.workflow_run.conclusion;

      // Fetch channel(s) for this repo from DB
      const repoChannels = await RepoChannelModel.find({ repoName: repo });

      if (!repoChannels.length) {
        console.log(`No Slack channels configured for repo: ${repo}`);
        return res.status(200).send("No channels");
      }

      // Send message to each channel
      for (const rc of repoChannels) {
        const message =
          conclusion === "failure"
            ? `❌ Build failed for *${repo}*`
            : `✅ Workflow completed: ${conclusion} for *${repo}*`;

        try {
          await this.slackClient.client.chat.postMessage({
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
      //fetch user access token
      const user = await UserModel.findById(userId);
      const response = await axios.get("https://api.github.com/user/repos", {
        headers: {
          Authorization: `token ${user?.github?.access_token}`,
          Accept: "application/vnd.github.v3+json",
        },
        params: {
          per_page: 100, // number of repos per page
          sort: "updated", // optional: sort by last updated
        },
      });
      const repos = response.data;
      res.status(200).json(repos);
    } catch (err) {
      console.error("Error fetching user repos:", err);
      res.status(500).send("error");
    }
  }

  async connectRepoChannel(req: Request, res: Response) {
    const { repoName, slackChannelId } = req.body;

    if (!repoName || !slackChannelId) {
      return res
        .status(400)
        .json({ message: "Missing repoName or slackChannelId" });
    }

    try {
      // Check if the repo is already connected
      const existing = await RepoChannelModel.findOne({
        repoName,
        slackChannelId,
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

      res.status(201).json({
        message: "Repo connected to Slack channel",
      });
    } catch (err) {
      console.error("Error connecting repo to channel:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
