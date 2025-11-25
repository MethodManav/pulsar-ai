import express from "express";
import { AuthController } from "../controller/AuthController";
import { CommonRouteConfig } from "../utiles/commonRouteConfig";

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Authentication endpoints for OAuth providers
 */

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
    
    /**
     * @swagger
     * /auth/authorize:
     *   get:
     *     tags: [Authentication]
     *     summary: Authorize OAuth provider
     *     description: Initiates OAuth flow with GitHub or Slack
     *     parameters:
     *       - in: query
     *         name: provider
     *         required: true
     *         schema:
     *           type: string
     *           enum: [github, slack]
     *         description: OAuth provider to authorize
     *     responses:
     *       302:
     *         description: Redirect to OAuth provider
     *       400:
     *         description: Invalid provider
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    this.app.get(`${this.path}/authorize`, authController.authorizeProvider);
    
    /**
     * @swagger
     * /auth/callback:
     *   post:
     *     tags: [Authentication]
     *     summary: Handle OAuth provider callback
     *     description: Processes OAuth callback and returns access token
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - code
     *               - provider
     *             properties:
     *               code:
     *                 type: string
     *                 description: Authorization code from OAuth provider
     *               provider:
     *                 type: string
     *                 enum: [github, slack]
     *                 description: OAuth provider
     *     responses:
     *       200:
     *         description: Authentication successful
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 accessToken:
     *                   type: string
     *                   description: JWT access token
     *                 user:
     *                   $ref: '#/components/schemas/User'
     *       400:
     *         description: Invalid request or authorization failed
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    this.app.post(
      `${this.path}/callback`,
      authController.handleProviderCallback
    );
  }
}
