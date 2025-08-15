import { AuthRoute } from "./Auth";
import { GithubRoute } from "./GithubRoute";

export class Routes {
  constructor(private app: any) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    new AuthRoute(this.app);
    new GithubRoute(this.app);
  }
}
