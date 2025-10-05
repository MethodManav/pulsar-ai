import { AuthRoute } from "./Auth";
import { GithubRoutes } from "./Github";
import { GithubApp } from "./GithubApp";
import { SlackRoutes } from "./Slack";
import { UserRoutes } from "./User";

export class Routes {
  constructor(private app: any) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    new AuthRoute(this.app);
    new UserRoutes(this.app);
    new GithubRoutes(this.app);
    new SlackRoutes(this.app);
    new GithubApp(this.app);
  }
}
