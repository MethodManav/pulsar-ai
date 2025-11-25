import express from "express";
import cors from "cors";
import { Routes } from "./routes/routes";
import { DatabaseConfig } from "./model/DatabaseConfig";
import { config } from "./utiles/Config";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import { specs } from "./swagger/swaggerConfig";

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
    
    // Swagger UI setup
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Pulsar AI API Documentation'
    }));
    
    // OpenAPI JSON endpoint
    this.app.get('/api-docs.json', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(specs);
    });
    
    this.app.listen(5000, () => {
      console.log("Server is running on port 5000");
      console.log("API Documentation available at: http://localhost:5000/api-docs");
      console.log("OpenAPI JSON spec available at: http://localhost:5000/api-docs.json");
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
