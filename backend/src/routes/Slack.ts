import { SlackController } from "../controller/SlackController";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { CommonRouteConfig } from "../utiles/commonRouteConfig";
import express from "express";

/**
 * @swagger
 * tags:
 *   - name: Slack
 *     description: Slack integration endpoints
 */
export class SlackRoutes extends CommonRouteConfig {
  private app: express.Application;
  private path: string;
  constructor(app: express.Application) {
    super();
    this.app = app;
    this.path = "/slack";
    this.configureRoutes();
  }

  public configureRoutes() {
    const slackController = new SlackController();
    
    /**
     * @swagger
     * /slack/channel-list:
     *   get:
     *     tags: [Slack]
     *     summary: Get Slack channels
     *     description: Retrieves all Slack channels accessible to the authenticated user
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       200:
     *         description: Channels retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/SlackChannel'
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
      `${this.path}/channel-list`,
      AuthMiddleware.isValidateJWT,
      AuthMiddleware.isGithubAuthenticated,
      slackController.getAllChannels
    );
    
    /**
     * @swagger
     * /slack/get-user/connected-channel:
     *   get:
     *     tags: [Slack]
     *     summary: Get user's connected channels
     *     description: Retrieves all Slack channels connected to GitHub repositories for the authenticated user
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       200:
     *         description: Connected channels retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   channelId:
     *                     type: string
     *                     description: Slack channel ID
     *                   channelName:
     *                     type: string
     *                     description: Slack channel name
     *                   repoId:
     *                     type: string
     *                     description: Connected GitHub repository ID
     *                   repoName:
     *                     type: string
     *                     description: Connected GitHub repository name
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
      `${this.path}/get-user/connected-channel`,
      AuthMiddleware.isValidateJWT,
      AuthMiddleware.isGithubAuthenticated,
      slackController.getUserConnectedChannel
    );
  }
}
