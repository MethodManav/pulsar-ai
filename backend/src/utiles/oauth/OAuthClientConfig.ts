export interface ApplicationConfigResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
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
    code: string
  ): Promise<ApplicationConfigResponse>;
  abstract getUserDetails(accessToken: string): Promise<any>;
}
