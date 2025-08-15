import express from "express";
import { AuthController } from "../controller/AuthController";

export class AuthRoute {
  private app: express.Application;
  private path: string;
  constructor(app: express.Application) {
    this.app = app;
    this.path = "/auth";
    this.initializeRoutes();
  }

  private initializeRoutes() {
    const authController = new AuthController();
    this.app.get(`${this.path}/authorize`, authController.authorizeProvider);
  }
}
