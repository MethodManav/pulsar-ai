import { GithubController } from "../controller/GithubController";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { CommonRouteConfig } from "../utiles/commonRouteConfig";
import express from "express";

export class GithubRoutes extends CommonRouteConfig {
  private app: express.Application;
  private path: string;
  constructor(app: express.Application) {
    super();
    this.app = app;
    this.path = "/github";
  }
  public configureRoutes(): void {
    const githubController = new GithubController();
    this.app.post(`${this.path}/events`, githubController.webhookEventHandler);
    this.app.get(
      `${this.path}/repos`,
      AuthMiddleware.isValidateJWT,
      AuthMiddleware.isGithubAuthenticated,
      githubController.getAllUserRepos
    );
  }
}
