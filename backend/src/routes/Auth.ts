import express from "express";
import { AuthController } from "../controller/AuthController";

export class AuthRoute extends CommonRouteConfig {
  private app: express.Application;
  private path: string;
  constructor(app: express.Application) {
    super();
    this.app = app;
    this.path = "/auth";
    this.configureRoutes();
  }

  public configureRoutes() {
    const authController = new AuthController();
    this.app.get(`${this.path}/authorize`, authController.authorizeProvider);
    this.app.post(
      `${this.path}/callback`,
      authController.handleProviderCallback
    );
  }
}
