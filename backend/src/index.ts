import express from "express";
import cors from "cors";
import { Routes } from "./routes/routes";
import { DatabaseConfig } from "./model/DatabaseConfig";
import { config } from "./utiles/Config";
import bodyParser from "body-parser";

class CreateServer {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.configureMiddleware();
  }

  private configureMiddleware() {
    this.app.use(
      cors({
        origin: config.CORS_ORIGIN,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
      })
    );
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
    const db = new DatabaseConfig();
    db.connect();
  }

  public getApp(): express.Application {
    return this.app;
  }
}

const server = new CreateServer();
const app = server.getApp();
new Routes(app);
