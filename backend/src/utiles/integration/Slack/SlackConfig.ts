import { config } from "../../Config";

const slackConfig = {
  authorizationUrl: "https://slack.com/oauth/v2/authorize",
  tokenUrl: "https://slack.com/api/oauth.v2.access",
  revokeUrl: "https://slack.com/api/auth.revoke",
  clientId: config.SLACK_CLIENT_ID,
  clientSecret: config.SLACK_CLIENT_SECRET,
  redirectUri: config.SLACK_REDIRECT_URI,
  scope: "chat:write,channels:read,groups:read",
};

export default slackConfig;
