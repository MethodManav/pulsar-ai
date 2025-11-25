import { GithubController } from "../controller/GithubController";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { CommonRouteConfig } from "../utiles/commonRouteConfig";
import express from "express";

/**
 * @swagger
 * tags:
 *   - name: GitHub
 *     description: GitHub integration endpoints
 */

export class GithubRoutes extends CommonRouteConfig {
  private app: express.Application;
  private path: string;
  constructor(app: express.Application) {
    super();
    this.app = app;
    this.path = "/github";
    this.configureRoutes();
  }
  public configureRoutes(): void {
    const githubController = new GithubController();
    
    /**
     * @swagger
     * /github/events:
     *   post:
     *     tags: [GitHub]
     *     summary: Handle GitHub webhook events
     *     description: Processes incoming GitHub webhook events
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             description: GitHub webhook payload
     *     responses:
     *       200:
     *         description: Webhook processed successfully
     *       400:
     *         description: Invalid webhook payload
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    this.app.post(`${this.path}/events`, githubController.webhookEventHandler);
    
    /**
     * @swagger
     * /github/repos:
     *   get:
     *     tags: [GitHub]
     *     summary: Get user repositories
     *     description: Retrieves all repositories accessible to the authenticated user
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       200:
     *         description: Repositories retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Repository'
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
      `${this.path}/repos`,
      AuthMiddleware.isValidateJWT,
      AuthMiddleware.isGithubAuthenticated,
      githubController.getAllUserRepos
    );
    
    /**
     * @swagger
     * /github/connect-repo:
     *   post:
     *     tags: [GitHub]
     *     summary: Connect repository to Slack channel
     *     description: Creates a connection between a GitHub repository and a Slack channel
     *     security:
     *       - BearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/ConnectRepoRequest'
     *     responses:
     *       200:
     *         description: Repository connected successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   description: Success message
     *                 connection:
     *                   type: object
     *                   properties:
     *                     repoId:
     *                       type: string
     *                     channelId:
     *                       type: string
     *       400:
     *         description: Invalid request data
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
      `${this.path}/connect-repo`,
      AuthMiddleware.isValidateJWT,
      AuthMiddleware.isGithubAuthenticated,
      githubController.connectRepoChannel
    );
  }
}
