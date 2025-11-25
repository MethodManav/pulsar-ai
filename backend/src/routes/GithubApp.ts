import { GithubAppController } from "../controller/GithubAppController";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { CommonRouteConfig } from "../utiles/commonRouteConfig";
import express from "express";

/**
 * @swagger
 * tags:
 *   - name: GitHub App
 *     description: GitHub App installation endpoints
 */

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
    
    /**
     * @swagger
     * /github-app/new-app:
     *   get:
     *     tags: [GitHub App]
     *     summary: Get GitHub App installation URL
     *     description: Generates and returns the URL for installing the GitHub App
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       200:
     *         description: Installation URL generated successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 installationUrl:
     *                   type: string
     *                   format: uri
     *                   description: URL to install the GitHub App
     *       401:
     *         description: Unauthorized - Invalid or missing token
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *       403:
     *         description: Forbidden - GitHub authentication required
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    this.app.get(
      `${this.path}/new-app`,
      AuthMiddleware.isValidateJWT,
      AuthMiddleware.isGithubAuthenticated,
      githubController.getInstallationUrl
    );
    
    /**
     * @swagger
     * /github-app/callback:
     *   post:
     *     tags: [GitHub App]
     *     summary: Handle GitHub App installation callback
     *     description: Processes the callback after GitHub App installation
     *     security:
     *       - BearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - installation_id
     *               - setup_action
     *             properties:
     *               installation_id:
     *                 type: string
     *                 description: GitHub App installation ID
     *               setup_action:
     *                 type: string
     *                 enum: [install, update]
     *                 description: The setup action performed
     *     responses:
     *       200:
     *         description: Installation processed successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   description: Success message
     *                 installationId:
     *                   type: string
     *                   description: GitHub App installation ID
     *       400:
     *         description: Invalid callback data
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *       401:
     *         description: Unauthorized - Invalid or missing token
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *       403:
     *         description: Forbidden - GitHub authentication required
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    this.app.post(
      `${this.path}/callback`,
      AuthMiddleware.isValidateJWT,
      AuthMiddleware.isGithubAuthenticated,
      githubController.setInstallationUrl
    );
  }
}
