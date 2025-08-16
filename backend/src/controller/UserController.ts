import { Request, Response } from "express";
import UserModel from "../model/UserModel";
export class UserController {
  async getMy(req: Request, res: Response) {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const user = await UserModel.findById(userId).select({
        username: 1,
        "slack.connected": 1,
        "github.connected": 1,
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json({ user });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
