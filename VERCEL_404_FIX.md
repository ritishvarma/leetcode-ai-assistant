# Fix Vercel 404 Error

You're getting a 404 because Vercel doesn't know where your Next.js app is located (it's in the `frontend` subdirectory).

## Quick Fix (Do This Now)

### Step 1: Update Vercel Project Settings

1. Go to your Vercel project: https://vercel.com/dashboard
2. Click on your project (`leetcode-ai-assistant`)
3. Go to **Settings** → **General**
4. Scroll down to **Build & Development Settings**
5. Click **Edit** next to "Root Directory"
6. Enter: `frontend`
7. Click **Save**

### Step 2: Redeploy

1. Go to **Deployments** tab
2. Click the three dots (...) on the latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger automatic deployment

## Why This Happens

Your repository structure is:
```
leetcode-ai-assistant/
├── frontend/          ← Next.js app is here
│   ├── package.json
│   ├── src/
│   └── ...
└── backend/
```

Vercel was looking for `package.json` in the root directory, but it's actually in `frontend/`.

## Verify It Works

After redeploying with the root directory set to `frontend`:
1. Visit your Vercel URL
2. You should see the AlgoMentor AI chat interface
3. No more 404 error!

## Alternative: Restructure Repository (Not Recommended Now)

If you want to avoid setting root directory, you could move frontend files to root:
```bash
# Don't do this now - just use the dashboard setting
mv frontend/* .
rm -rf frontend
```

But the dashboard setting is cleaner for monorepo structures.

## Next Steps After Fixing 404

1. **Set Environment Variable** in Vercel:
   - Go to Settings → Environment Variables
   - Add: `NEXT_PUBLIC_API_URL` = `https://your-backend-url.com`
   - Redeploy

2. **Deploy Backend** (if not done yet):
   - Deploy to Render, Railway, or Fly.io
   - Set `HF_TOKEN` and `ALLOWED_ORIGINS` environment variables

3. **Update Backend CORS**:
   - Add your Vercel URL to `ALLOWED_ORIGINS`
   - Example: `https://your-app.vercel.app,http://localhost:3000`

## Still Getting 404?

If the above doesn't work:

1. Check Vercel build logs for errors
2. Ensure `frontend/package.json` exists
3. Verify Next.js version is compatible (you have 16.1.6 which is fine)
4. Try deleting the project and reimporting from GitHub with root directory set from the start
