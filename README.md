# Pulsar AI

A full-stack web application that integrates with GitHub and Slack to provide seamless workflow automation and team collaboration.

## Features

- **GitHub Integration**: Connect and manage GitHub repositories
- **Slack Integration**: Streamlined communication and notifications
- **User Authentication**: Secure OAuth-based authentication system
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS using shadcn/ui components
- **Responsive Design**: Mobile-first approach with beautiful particle background effects

## Tech Stack

### Backend
- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **OAuth** integration for GitHub and Slack
- **CORS** enabled for cross-origin requests

### Frontend
- **React 18** with **TypeScript**
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **React Router** for navigation
- **TanStack Query** for data fetching
- **Framer Motion** for animations

## Project Structure

```
pulsar-ai/
├── backend/                 # Node.js/Express API server
│   ├── src/
│   │   ├── controller/      # API controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── model/          # Database models
│   │   ├── routes/         # API routes
│   │   └── utiles/         # Utilities and integrations
│   └── package.json
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility libraries
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- GitHub OAuth App credentials
- Slack App credentials

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pulsar-ai
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### Environment Setup

Create `.env` files in both backend and frontend directories with the required environment variables for:
- Database connection
- GitHub OAuth credentials
- Slack API credentials
- JWT secrets
- CORS origins

### Development

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The backend will run on `http://localhost:5000` and the frontend on `http://localhost:5173`.

### Building for Production

1. Build the backend:
```bash
cd backend
npm run build
```

2. Build the frontend:
```bash
cd frontend
npm run build
```

## API Endpoints

- `/auth` - Authentication routes
- `/github` - GitHub integration endpoints
- `/slack` - Slack integration endpoints
- `/user` - User management routes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

ISC License