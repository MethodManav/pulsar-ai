import { getConfigByProvider } from "../Config";
import { GithubClient } from "../integration/Github/GithubClient";
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
      default:
        throw new Error("Unsupported OAuth provider");
    }
  }
}
