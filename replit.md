# Tech Staff Evaluation Platform

## Overview
This is a React-based web application for evaluating technical staff performance. It includes features for attendance tracking, performance reviews, peer reviews, project management, and analytics dashboards. The application was imported from a Figma design and built using modern React with TypeScript and Vite.

## Tech Stack
- **Frontend Framework**: React 18.3.1
- **Build Tool**: Vite 6.3.5
- **Language**: TypeScript
- **UI Components**: Radix UI
- **Styling**: CSS with Tailwind-like patterns
- **Additional Libraries**:
  - Recharts for charts
  - Lucide React for icons
  - React Hook Form for form management
  - React DnD for drag-and-drop functionality
  - date-fns for date manipulation

## Project Structure
```
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # Reusable UI components (buttons, inputs, etc.)
│   │   ├── figma/        # Figma-generated components
│   │   └── *Page.tsx     # Page components for different features
│   ├── styles/           # Global styles
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Application entry point
├── index.html            # HTML template
├── vite.config.ts        # Vite configuration
└── package.json          # Dependencies
```

## Development Setup

### Running Locally
The development server is configured to run on port 5000 with Replit's environment:
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

## Replit Configuration

### Development Server
- **Port**: 5000
- **Host**: 0.0.0.0 (allows external connections)
- **HMR**: Configured for Replit's WebSocket proxy using REPLIT_DEV_DOMAIN environment variable

### Deployment
- **Type**: Autoscale (static website)
- **Build Command**: `npm run build`
- **Run Command**: `npx vite preview --host 0.0.0.0 --port 5000`
- **Output Directory**: `build`

## Recent Changes (November 6, 2025)
- Imported project from GitHub
- Installed Node.js 20 and all dependencies
- Created TypeScript configuration files (tsconfig.json, tsconfig.node.json)
- Configured Vite for Replit environment with proper HMR WebSocket support
- Created .gitignore for Node.js/React projects
- Set up development workflow and deployment configuration
- Fixed HMR WebSocket connection to work with Replit's HTTPS proxy

## Features
- **Admin Dashboard**: Overview of staff and system metrics
- **Staff Management**: Enrollment, overview, and attendance tracking
- **Performance Evaluation**: Reviews, peer reviews, and progress reports
- **Project Management**: Task and project tracking
- **Analytics**: Department analytics and performance insights
- **Communication**: Chat, announcements, and notifications
- **Leave Management**: Request and approval system
- **Reports**: Comprehensive reporting features
- **Leaderboard**: Staff performance rankings
- **Settings**: User and system configuration

## Known Issues
None currently. All systems operational.

## User Preferences
None documented yet.
