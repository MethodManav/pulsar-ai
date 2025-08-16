import { ObjectId } from "mongoose";
import UserModel from "../../../model/UserModel";
import { GithubAuth, OAuthClientConfig } from "../../oauth/OAuthClientConfig";
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
  async exchangeCodeForToken(code: string, state: string): Promise<GithubAuth> {
    const { tokenUrl } = githubConfig;
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
      let githubAuth: GithubAuth = {
        github: {
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          expires_in: data.expires_in,
        },
      };
      return githubAuth;
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

  async refreshGitHubToken(
    refreshToken: string,
    userId: string | ObjectId
  ): Promise<boolean> {
    const { refreshTokenUrl } = githubConfig;
    try {
      const params = new URLSearchParams({
        client_id: super.getClientId(),
        client_secret: super.getClientSecret(),
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      });

      const response = await fetch(refreshTokenUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      if (!response.ok) {
        throw new Error("Failed to refresh access token");
      }

      const data = await response.json();
      const UserUpdate = UserModel.findByIdAndUpdate(
        {
          _id: userId,
        },
        {
          $set: {
            github: {
              access_token: data.access_token,
              refresh_token: data.refresh_token,
              expires_in: data.expires_in,
              updatedAt: new Date(),
            },
          },
        }
      );
      return true;
    } catch (error) {
      console.error("Error refreshing access token:", error);
      throw error;
    }
  }
}
