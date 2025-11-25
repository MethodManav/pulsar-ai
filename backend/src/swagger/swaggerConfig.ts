import swaggerJsdoc from 'swagger-jsdoc';
import { config } from '../utiles/Config';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pulsar AI API',
      version: '1.0.0',
      description: 'API documentation for Pulsar AI - A GitHub and Slack integration platform',
      contact: {
        name: 'Pulsar AI Team',
        email: 'support@pulsar-ai.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
      {
        url: 'https://pulsar-ai.onrender.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
            message: {
              type: 'string',
              description: 'Detailed error description',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'User ID',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            githubId: {
              type: 'string',
              description: 'GitHub user ID',
            },
            slackId: {
              type: 'string',
              description: 'Slack user ID',
            },
            accessToken: {
              type: 'string',
              description: 'Access token for API authentication',
            },
          },
        },
        Repository: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
              description: 'Repository ID',
            },
            name: {
              type: 'string',
              description: 'Repository name',
            },
            fullName: {
              type: 'string',
              description: 'Full repository name (owner/repo)',
            },
            description: {
              type: 'string',
              description: 'Repository description',
            },
            private: {
              type: 'boolean',
              description: 'Whether the repository is private',
            },
            htmlUrl: {
              type: 'string',
              format: 'uri',
              description: 'Repository URL on GitHub',
            },
          },
        },
        SlackChannel: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Channel ID',
            },
            name: {
              type: 'string',
              description: 'Channel name',
            },
            isChannel: {
              type: 'boolean',
              description: 'Whether it is a channel (vs. direct message)',
            },
            isPrivate: {
              type: 'boolean',
              description: 'Whether the channel is private',
            },
          },
        },
        ConnectRepoRequest: {
          type: 'object',
          required: ['repoId', 'channelId'],
          properties: {
            repoId: {
              type: 'string',
              description: 'GitHub repository ID',
            },
            channelId: {
              type: 'string',
              description: 'Slack channel ID',
            },
          },
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controller/*.ts'], // Path to the API files
};

export const specs = swaggerJsdoc(options);
