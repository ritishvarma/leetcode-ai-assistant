# Deployment Guide

## Prerequisites

Before deploying, ensure you have:
- A GitHub account
- A Vercel account (for frontend)
- A Render/Railway/Fly.io account (for backend)
- A Hugging Face API token

## Backend Deployment (Render)

### Step 1: Prepare the Backend

1. Ensure `faiss_index.bin` and `metadata.json` are generated locally:
   ```bash
   cd backend
   python ingest.py
   ```

2. Commit these files to your repository (they're needed for the RAG pipeline).

### Step 2: Deploy to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `algomentor-backend` (or your choice)
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

5. Add Environment Variables:
   - `HF_TOKEN`: Your Hugging Face API token
   - `ALLOWED_ORIGINS`: Your frontend URL (e.g., `https://your-app.vercel.app`)

6. Click "Create Web Service"

7. Copy the deployed backend URL (e.g., `https://algomentor-backend.onrender.com`)

## Frontend Deployment (Vercel)

### Step 1: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

5. Add Environment Variable:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: Your backend URL (e.g., `https://algomentor-backend.onrender.com`)

6. Click "Deploy"

### Step 2: Update Backend CORS

After deployment, update your backend's `ALLOWED_ORIGINS` environment variable on Render to include your Vercel URL:
```
ALLOWED_ORIGINS=https://your-app.vercel.app,http://localhost:3000
```

## Alternative Backend Hosting

### Railway

1. Go to [Railway](https://railway.app/)
2. Create new project from GitHub repo
3. Set root directory to `backend`
4. Add environment variables: `HF_TOKEN`, `ALLOWED_ORIGINS`
5. Railway will auto-detect Python and deploy

### Fly.io

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Create `backend/fly.toml`:
   ```toml
   app = "algomentor-backend"
   
   [build]
   
   [env]
   PORT = "8080"
   
   [[services]]
   internal_port = 8080
   protocol = "tcp"
   
   [[services.ports]]
   handlers = ["http"]
   port = 80
   
   [[services.ports]]
   handlers = ["tls", "http"]
   port = 443
   ```
3. Deploy: `fly deploy`

## Post-Deployment Checklist

- [ ] Backend is accessible and returns `{"status": "ok"}` at `/health`
- [ ] Frontend loads without errors
- [ ] Chat functionality works end-to-end
- [ ] CORS is properly configured
- [ ] Environment variables are set correctly
- [ ] FAISS index files are included in backend deployment
- [ ] API responses are formatted correctly

## Troubleshooting

### Backend Issues

**Problem**: "RAG Pipeline not initialized"
- **Solution**: Ensure `faiss_index.bin` and `metadata.json` are in the backend directory and committed to Git

**Problem**: CORS errors
- **Solution**: Update `ALLOWED_ORIGINS` to include your frontend URL

**Problem**: "HF_TOKEN not found"
- **Solution**: Add `HF_TOKEN` environment variable in your hosting platform

### Frontend Issues

**Problem**: "Failed to fetch from backend"
- **Solution**: Verify `NEXT_PUBLIC_API_URL` is set correctly in Vercel

**Problem**: API calls fail in production
- **Solution**: Check browser console for CORS errors and verify backend CORS settings

## Monitoring

- Monitor backend logs in Render/Railway dashboard
- Check Vercel deployment logs for frontend issues
- Use `/health` endpoint to verify backend status

## Scaling Considerations

- Consider using a CDN for frontend assets (Vercel provides this)
- For high traffic, upgrade backend instance size
- Consider caching frequently requested responses
- Monitor Hugging Face API rate limits
