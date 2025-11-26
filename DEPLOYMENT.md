# Deployment Guide

## Step 1: Push to GitHub

1. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Name it `chaos-merge` (or your preferred name)
   - Don't initialize with README, .gitignore, or license (we already have these)

2. **Push your code:**
```bash
# Add all files
git add .

# Commit
git commit -m "Initial commit: ChaosMerge video merger"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/chaos-merge.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 2: Deploy Frontend to Vercel

1. **Go to Vercel:**
   - Visit https://vercel.com
   - Sign in with GitHub

2. **Import Project:**
   - Click "Add New" → "Project"
   - Select your `chaos-merge` repository
   - Click "Import"

3. **Configure Build Settings:**
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `npm run build --workspace @chaos-merge/web`
   - **Output Directory**: `apps/web/dist`
   - **Install Command**: `npm install`

4. **Add Environment Variable:**
   - Go to "Environment Variables"
   - Add: `VITE_API_BASE` = `https://your-api-url.com/api`
   - (You'll update this after deploying the API)

5. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete

## Step 3: Deploy Backend API

The API needs FFmpeg, so it's best deployed on platforms that support it:

### Option A: Railway (Recommended)

1. Go to https://railway.app
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. In project settings:
   - **Root Directory**: `apps/api`
   - **Start Command**: `npm start`
6. Add environment variable:
   - `NODE_ENV` = `production`
7. Railway will provide a URL like `https://your-app.railway.app`
8. Update Vercel's `VITE_API_BASE` to: `https://your-app.railway.app/api`

### Option B: Render

1. Go to https://render.com
2. Sign in with GitHub
3. Click "New" → "Web Service"
4. Connect your repository
5. Configure:
   - **Name**: `chaos-merge-api`
   - **Root Directory**: `apps/api`
   - **Environment**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
6. Add environment variable:
   - `NODE_ENV` = `production`
7. Render will provide a URL
8. Update Vercel's `VITE_API_BASE` to: `https://your-app.onrender.com/api`

### Option C: Fly.io

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. In `apps/api` directory, run: `fly launch`
3. Follow prompts
4. Deploy: `fly deploy`
5. Get URL: `fly info`
6. Update Vercel's `VITE_API_BASE`

## Important Notes

- **FFmpeg**: The API requires FFmpeg. Railway and Render support it, but you may need to add a buildpack or install it in your Dockerfile.
- **File Storage**: Uploaded files are stored locally. For production, consider using S3 or similar.
- **CORS**: Make sure your API allows requests from your Vercel domain.

## Updating After Deployment

1. Make changes locally
2. Commit: `git commit -am "Your commit message"`
3. Push: `git push`
4. Vercel will auto-deploy
5. API will need manual redeploy (or set up auto-deploy)

