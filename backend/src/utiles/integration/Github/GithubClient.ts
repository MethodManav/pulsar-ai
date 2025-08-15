import { OAuthClientConfig } from "../../oauth/OAuthClientConfig";
import githubConfig from "./GithubConfig";

export class GithubClient extends OAuthClientConfig {
  constructor(clientId: string, clientSecret: string) {
    super(clientId, githubConfig.redirectUri, githubConfig.scope, clientSecret);
  }
  getAuthorizationUrl() {
    const { authorizationUrl } = githubConfig;
    const clientId = super.getClientId();
    const redirectUri = super.getRedirectUri();
    const scopes = super.getScopes().join(" ");
    const state = Math.random().toString(36).substring(2, 15);
    return `${authorizationUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}&state=${state}`;
  }
  async exchangeCodeForToken(code: string): Promise<string> {
    const { tokenUrl } = githubConfig;
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: super.getClientId(),
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: super.getRedirectUri(),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to exchange code for token");
    }

    const data = await response.json();
    return data.access_token;
  }
}
