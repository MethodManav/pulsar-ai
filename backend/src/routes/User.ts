import { UserController } from "../controller/UserController";
import express from "express";
import { CommonRouteConfig } from "../utiles/commonRouteConfig";
import { AuthMiddleware } from "../middleware/AuthMiddleware";

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: User management endpoints
 */

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
    
    /**
     * @swagger
     * /user/my:
     *   get:
     *     tags: [User]
     *     summary: Get current user information
     *     description: Retrieves information about the authenticated user
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       200:
     *         description: User information retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
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
      `${this.path}/my`,
      AuthMiddleware.isValidateJWT,
      AuthMiddleware.isGithubAuthenticated,
      userController.getMy.bind(userController)
    );
  }
}
