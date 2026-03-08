# Vercel Deployment Setup

## Configuration Steps

Since this is a monorepo with frontend in a subdirectory, configure Vercel as follows:

### 1. Import Project from GitHub
- Go to [Vercel Dashboard](https://vercel.com/dashboard)
- Click "Add New..." → "Project"
- Import your GitHub repository: `ritishvarma/leetcode-ai-assistant`

### 2. Configure Project Settings

In the project configuration screen:

**Framework Preset**: Next.js

**Root Directory**: `frontend` (click "Edit" and select the frontend folder)

**Build and Output Settings**:
- Build Command: `npm run build` (default)
- Output Directory: `.next` (default)
- Install Command: `npm install` (default)

**Environment Variables**:
Add the following environment variable:
- Key: `NEXT_PUBLIC_API_URL`
- Value: Your backend URL (e.g., `https://your-backend.onrender.com`)

### 3. Deploy

Click "Deploy" and Vercel will:
1. Install dependencies from `frontend/package.json`
2. Build the Next.js application
3. Deploy to a production URL

### 4. Update Backend CORS

After deployment, update your backend's `ALLOWED_ORIGINS` environment variable to include your Vercel URL:

```
ALLOWED_ORIGINS=https://your-app.vercel.app,http://localhost:3000
```

## Why No vercel.json?

The `builds` property in `vercel.json` is deprecated. Vercel now recommends:
- Setting the root directory in the project settings (dashboard)
- Using framework-specific conventions
- Avoiding custom build configurations when possible

This approach:
- ✅ Eliminates deprecation warnings
- ✅ Uses Vercel's optimized Next.js detection
- ✅ Simplifies configuration
- ✅ Follows Vercel best practices

## Troubleshooting

### Build fails with "Cannot find package.json"
- Ensure Root Directory is set to `frontend` in project settings

### Environment variable not working
- Ensure `NEXT_PUBLIC_API_URL` is set in Vercel dashboard
- Redeploy after adding environment variables

### CORS errors in production
- Verify backend `ALLOWED_ORIGINS` includes your Vercel URL
- Check browser console for exact error message

## Alternative: Using vercel.json

If you prefer configuration as code, you can use this minimal `vercel.json`:

```json
{
  "buildCommand": "cd frontend && npm run build",
  "outputDirectory": "frontend/.next",
  "installCommand": "cd frontend && npm install"
}
```

However, setting the root directory in the dashboard is the recommended approach.
