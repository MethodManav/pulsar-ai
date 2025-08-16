import { UserController } from "../controller/UserController";
import express from "express";
import { CommonRouteConfig } from "../utiles/commonRouteConfig";
import { AuthMiddleware } from "../middleware/AuthMiddleware";

export class UserRoutes extends CommonRouteConfig {
  private app: express.Application;
  private path: string;
  constructor(app: express.Application) {
    super();
    this.app = app;
    this.path = "/user";
    this.configureRoutes();
  }
  public configureRoutes(): void {
    const userController = new UserController();
    this.app.get(
      `${this.path}/my`,
      AuthMiddleware.isValidateJWT,
      AuthMiddleware.isGithubAuthenticated,
      userController.getMy.bind(userController)
    );
  }
}
