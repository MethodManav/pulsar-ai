import { getConfigByProvider } from "../Config";
import { GithubClient } from "../integration/Github/GithubClient";
import { SlackClient } from "../integration/Slack/SlackClient";
import { OAuthClientConfig } from "./OAuthClientConfig";

export class AuthFactory {
  static createOAuthClient(type: string): OAuthClientConfig {
    switch (type) {
      case "github":
        const githubConfig = getConfigByProvider("github");
        return new GithubClient(
          githubConfig.clientId,
          githubConfig.clientSecret
        );
      case "slack":
        const slackConfig = getConfigByProvider("slack");
        return new SlackClient(slackConfig.clientId, slackConfig.clientSecret);
      default:
        throw new Error("Unsupported OAuth provider");
    }
  }
}
