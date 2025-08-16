export interface GithubAuth {
  github: {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
  };
  slack?: never; // ensures only one provider is allowed
}

// Slack interface
export interface SlackAuth {
  slack: {
    app_id: string;
    authed_user: {
      id: string;
    };
    scope: string;
    token_type: string;
    access_token: string;
    bot_user_id: string;
    team: {
      id: string;
      name: string;
    };
    enterprise: {};
    is_enterprise_install: boolean;
  };
  github?: never;
}

export abstract class OAuthClientConfig {
  clientId: string;
  redirectUri: string;
  scope: string;
  clientSecret: string;
  constructor(
    clientId: string,
    redirectUri: string,
    scope: string,
    clientSecret: string
  ) {
    this.clientId = clientId;
    this.redirectUri = redirectUri;
    this.scope = scope;
    this.clientSecret = clientSecret;
  }

  getClientSecret(): string {
    return this.clientSecret;
  }
  getClientId(): string {
    return this.clientId;
  }
  getRedirectUri(): string {
    return this.redirectUri;
  }
  getScopes(): string[] {
    return this.scope.split(" ");
  }
  abstract getAuthorizationUrl(): string;
  abstract exchangeCodeForToken(
    code: string,
    state: string
  ): Promise<GithubAuth | SlackAuth>;
  abstract getUserDetails(accessToken: string): Promise<any>;
}
