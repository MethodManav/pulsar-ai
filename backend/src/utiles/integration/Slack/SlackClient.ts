import { OAuthClientConfig } from "../../oauth/OAuthClientConfig";
import slackConfig from "./SlackConfig";

export class SlackClient extends OAuthClientConfig {
  constructor(clientId: string, clientSecret: string) {
    super(clientId, slackConfig.redirectUri, slackConfig.scope, clientSecret);
  }

  getAuthorizationUrl() {
    const { authorizationUrl } = slackConfig;
    const clientId = super.getClientId();
    const redirectUri = super.getRedirectUri();
    const scopes = super.getScopes().join(" ");
    const state = Math.random().toString(36).substring(2, 15);
    return `${authorizationUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}&state=${state}`;
  }

  async exchangeCodeForToken(code: string, state: string) {
    const { tokenUrl } = slackConfig;
    try {
      const params = new URLSearchParams({
        client_id: super.getClientId(),
        client_secret: super.getClientSecret(),
        code,
        redirect_uri: super.getRedirectUri(),
        state,
      });

      const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to exchange code for token: ${response.statusText}`
        );
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error exchanging code for token:", error);
      throw error;
    }
  }
  async getUserDetails(accessToken: string): Promise<any> {
    return;
  }
}
