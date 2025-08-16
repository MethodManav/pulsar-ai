import { AuthRoute } from "./Auth";
import { UserRoutes } from "./User";

export class Routes {
  constructor(private app: any) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    new AuthRoute(this.app);
    new UserRoutes(this.app);
  }
}
