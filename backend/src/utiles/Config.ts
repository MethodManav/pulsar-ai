import dotenv from "dotenv";
dotenv.config();

interface IConfig {
  PORT: number;
  DB_URL: string;
  DB_APP: string;
  JWT_SECRET: string;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  GITHUB_REDIRECT_URI: string;
  SLACK_CLIENT_ID: string;
  SLACK_CLIENT_SECRET: string;
  CORS_ORIGIN: string;
}

export const config: IConfig = {
  PORT: Number(process.env.PORT) || 3000,
  DB_URL: process.env.DB_URL as string,
  DB_APP: process.env.DB_APP as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID as string,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET as string,
  GITHUB_REDIRECT_URI: process.env.GITHUB_REDIRECT_URI as string,
  SLACK_CLIENT_ID: process.env.SLACK_CLIENT_ID as string,
  SLACK_CLIENT_SECRET: process.env.SLACK_CLIENT_SECRET as string,
  CORS_ORIGIN: process.env.CORS_ORIGIN as string,
};

export const getConfigByProvider = (
  key: keyof IConfig | "github" | "slack"
): { clientId: string; clientSecret: string } => {
  if (key === "github") {
    return {
      clientId: config.GITHUB_CLIENT_ID,
      clientSecret: config.GITHUB_CLIENT_SECRET,
    };
  }
  if (key === "slack") {
    return {
      clientId: config.SLACK_CLIENT_ID,
      clientSecret: config.SLACK_CLIENT_SECRET,
    };
  }
  throw new Error(`Unsupported provider: ${key}`);
};
