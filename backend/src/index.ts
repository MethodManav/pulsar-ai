import express from "express";
import cors from "cors";

class CreateServer {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.configureMiddleware();
  }

  private configureMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
}

const server = new CreateServer();
const app = server.getApp();
