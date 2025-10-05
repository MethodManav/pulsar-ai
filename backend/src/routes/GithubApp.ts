import { GithubAppController } from "../controller/GithubAppController";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { CommonRouteConfig } from "../utiles/commonRouteConfig";
import express from "express";

export class GithubApp extends CommonRouteConfig {
  private app: express.Application;
  private path: string;

  constructor(app: express.Application) {
    super();
    this.app = app;
    this.path = "/github-app";
    this.configureRoutes();
  }
  public configureRoutes(): void {
    const githubController = new GithubAppController();
    this.app.get(
      `${this.path}/new-app`,
      AuthMiddleware.isValidateJWT,
      AuthMiddleware.isGithubAuthenticated,
      githubController.getInstallationUrl
    );
    this.app.post(
      `${this.path}/callback`,
      AuthMiddleware.isValidateJWT,
      AuthMiddleware.isGithubAuthenticated,
      githubController.setInstallationUrl
    );
  }
}
