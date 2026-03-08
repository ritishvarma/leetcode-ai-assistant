# Pre-Deployment Checklist

Use this checklist before pushing to Git and deploying to production.

## Backend Checks

- [ ] **FAISS Index Generated**: Run `python backend/ingest.py` to generate `faiss_index.bin` and `metadata.json`
- [ ] **Environment Variables**: Create `backend/.env` with your `HF_TOKEN`
- [ ] **Dependencies Updated**: Ensure `backend/requirements.txt` is up to date
- [ ] **Test Locally**: Backend runs successfully with `uvicorn main:app --reload`
- [ ] **Health Check Works**: Visit `http://localhost:8000/health` and verify response
- [ ] **No Hardcoded URLs**: All URLs use environment variables

## Frontend Checks

- [ ] **Dependencies Installed**: Run `npm install` in `frontend/` directory
- [ ] **Environment Variables**: Create `frontend/.env.local` with `NEXT_PUBLIC_API_URL`
- [ ] **Build Succeeds**: Run `npm run build` without errors
- [ ] **Test Locally**: Frontend runs with `npm run dev` and connects to backend
- [ ] **No Console Errors**: Check browser console for errors
- [ ] **API Integration Works**: Test sending a message and receiving a response

## Git Repository Checks

- [ ] **Sensitive Files Excluded**: `.env` files are in `.gitignore`
- [ ] **Example Files Included**: `.env.example` files are committed
- [ ] **FAISS Files Committed**: `backend/faiss_index.bin` and `backend/metadata.json` are tracked
- [ ] **No Secrets in Code**: No API keys or tokens hardcoded in source files
- [ ] **Clean Git Status**: Run `git status` to verify no unwanted files

## Deployment Configuration

- [ ] **Vercel Config**: `vercel.json` exists and is properly configured
- [ ] **Backend Config**: `backend/Procfile` and `backend/runtime.txt` exist
- [ ] **CORS Configuration**: Backend uses `ALLOWED_ORIGINS` environment variable
- [ ] **API URL Configuration**: Frontend uses `NEXT_PUBLIC_API_URL` environment variable

## Documentation

- [ ] **README Updated**: Main README.md has deployment instructions
- [ ] **Deployment Guide**: DEPLOYMENT.md provides detailed steps
- [ ] **Environment Examples**: Both `.env.example` files are documented

## Testing Commands

### Backend
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
pip install -r requirements.txt
python ingest.py
uvicorn main:app --reload
# Visit http://localhost:8000/health
```

### Frontend
```bash
cd frontend
npm install
npm run build
npm run dev
# Visit http://localhost:3000
```

## Ready to Deploy?

If all items are checked, you're ready to:

1. **Commit and Push**:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Deploy Backend**: Follow instructions in DEPLOYMENT.md
3. **Deploy Frontend**: Follow instructions in DEPLOYMENT.md
4. **Configure Environment Variables**: Set up env vars in hosting platforms
5. **Test Production**: Verify the deployed application works end-to-end

## Common Issues

### "RAG Pipeline not initialized"
- Ensure `faiss_index.bin` and `metadata.json` are committed to Git
- Check backend logs for errors during startup

### CORS Errors
- Update `ALLOWED_ORIGINS` in backend to include frontend URL
- Format: `https://your-app.vercel.app,http://localhost:3000`

### "Failed to fetch from backend"
- Verify `NEXT_PUBLIC_API_URL` is set in Vercel
- Check backend is running and accessible
- Test backend `/health` endpoint directly

### Build Failures
- Check Node.js version (requires v18+)
- Check Python version (requires 3.10+)
- Verify all dependencies are in package.json/requirements.txt
