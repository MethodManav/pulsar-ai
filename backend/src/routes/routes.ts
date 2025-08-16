import { AuthRoute } from "./Auth";
import { GithubRoutes } from "./Github";
import { UserRoutes } from "./User";

export class Routes {
  constructor(private app: any) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    new AuthRoute(this.app);
    new UserRoutes(this.app);
    new GithubRoutes(this.app);
  }
}
