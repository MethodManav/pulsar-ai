import { config } from "../../Config";

const githubConfig = {
  authorizationUrl: "https://github.com/login/oauth/authorize",
  tokenUrl: "https://github.com/login/oauth/access_token",
  redirectUri: config.GITHUB_REDIRECT_URI,
  scope: "repo repo_deployment",
};
export default githubConfig;
