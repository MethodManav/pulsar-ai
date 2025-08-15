import {
  ApplicationConfigResponse,
  OAuthClientConfig,
} from "../../oauth/OAuthClientConfig";
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
  async exchangeCodeForToken(code: string): Promise<ApplicationConfigResponse> {
    const { tokenUrl } = githubConfig;

    try {
      const params = new URLSearchParams({
        client_id: super.getClientId(),
        client_secret: super.getClientSecret(),
        code,
        redirect_uri: super.getRedirectUri(),
      }).toString();

      const response = await fetch(`${tokenUrl}?${params}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to exchange code for token");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error exchanging code for token:", error);
      throw error;
    }
  }
  async getUserDetails(accessToken: string): Promise<any> {
    const { userInfoUrl } = githubConfig;

    try {
      const response = await fetch(userInfoUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-GitHub-Api-Version": "2022-11-28",
          Accept: "application/vnd.github+json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching user details:", error);
      throw error;
    }
  }
}
