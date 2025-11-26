# ChaosMerge

A modern video merging application built with React, TypeScript, and Express.

## Features

- 🎬 Upload multiple video files
- 🔄 Drag and drop to reorder clips
- 🎨 Modern, dark-themed UI
- 📊 Real-time merge progress tracking
- 💾 Download merged videos in MP4 or WEBM format

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Express, Node.js, TypeScript
- **Video Processing**: FFmpeg
- **Monorepo**: npm workspaces

## Prerequisites

- Node.js 18+ and npm
- FFmpeg installed on your system

### Installing FFmpeg

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

**macOS:**
```bash
brew install ffmpeg
```

**Windows:**
Download from [ffmpeg.org](https://ffmpeg.org/download.html)

## Development

1. Install dependencies:
```bash
npm install
```

2. Build shared types:
```bash
npm run build --workspace @chaos-merge/shared-types
```

3. Start development servers:
```bash
npm run dev
```

This starts:
- API server on `http://localhost:4000`
- Web app on `http://localhost:5173` (or next available port)

## Project Structure

```
chaos-merge/
├── apps/
│   ├── api/          # Express API server
│   └── web/          # React frontend
├── packages/
│   └── shared-types/ # Shared TypeScript types
└── package.json
```

## Deployment

### Frontend (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Set build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build --workspace @chaos-merge/web`
   - **Output Directory**: `apps/web/dist`
   - **Install Command**: `npm install`
4. Add environment variable:
   - `VITE_API_BASE`: Your API URL (e.g., `https://chaos-mergeapi-production.up.railway.app/api`)

### Backend (Railway/Render/Fly.io)

The API needs to be deployed separately. Recommended platforms:

**Railway:**
1. Connect your GitHub repo
2. Select the `apps/api` directory
3. Set start command: `npm start`
4. Add environment variables if needed

**Render:**
1. Create a new Web Service
2. Connect your GitHub repo
3. Set:
   - **Root Directory**: `apps/api`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`

**Environment Variables:**
- `API_PORT`: Port number (default: 4000)
- `NODE_ENV`: `production`

## Environment Variables

### API (.env)
```
API_PORT=4000
NODE_ENV=production
```

### Web (Vercel)
```
VITE_API_BASE=https://chaos-mergeapi-production.up.railway.app/api
```

## License

MIT

