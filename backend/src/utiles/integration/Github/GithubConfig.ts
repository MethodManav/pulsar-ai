import { config } from "../../Config";

const githubConfig = {
  // OAuth URLs (legacy)
  authorizationUrl: "https://github.com/login/oauth/authorize",
  tokenUrl: "https://github.com/login/oauth/access_token",
  userInfoUrl: "https://api.github.com/user",
  redirectUri: config.GITHUB_REDIRECT_URI,
  refreshTokenUrl: "https://github.com/login/oauth/access_token",
  scope: "repo repo_deployment",
  
  // GitHub App URLs
  installationUrl: "https://github.com/apps/app-pulsar-ai/installations/new",
  installationTokenUrl: "https://api.github.com/app/installations/{installation_id}/access_tokens",
  installationsUrl: "https://api.github.com/app/installations",
};
export default githubConfig;
