import { SlackController } from "../controller/SlackController";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { CommonRouteConfig } from "../utiles/commonRouteConfig";
import express from "express";
export class SlackRoutes extends CommonRouteConfig {
  private app: express.Application;
  private path: string;
  constructor(app: express.Application) {
    super();
    this.app = app;
    this.path = "/slack";
    this.configureRoutes();
  }

  public configureRoutes() {
    const slackController = new SlackController();
    this.app.get(
      `${this.path}/channel-list`,
      AuthMiddleware.isValidateJWT,
      AuthMiddleware.isGithubAuthenticated,
      slackController.getAllChannels
    );
  }
}
