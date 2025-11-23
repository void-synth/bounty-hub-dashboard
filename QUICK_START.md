# Quick Start Guide - Fix OAuth Errors

## Current Status

✅ Client ID configured: `Ov23lik2GgyOAg3BIaiV`  
❌ Client Secret needed  
❌ Backend server needs to be started  

## Fix the Two Errors

### Error 1: "Backend API URL not configured"
✅ **FIXED** - Added `VITE_BACKEND_API_URL=http://localhost:3000` to `.env`

### Error 2: "Invalid state parameter"  
✅ **FIXED** - Improved state verification to use both sessionStorage and localStorage

## Next Steps

### 1. Get Your GitHub Client Secret

1. Go to: https://github.com/settings/developers
2. Click on your OAuth App (Client ID: `Ov23lik2GgyOAg3BIaiV`)
3. Click **"Generate a new client secret"** button
4. **Copy the secret immediately** (you can only see it once!)
5. Update `.env` file:
   ```env
   GITHUB_CLIENT_SECRET=paste_your_secret_here
   ```

### 2. Start the Backend Server

Open a **new terminal** and run:

```bash
npm run dev:backend
```

You should see:
```
🚀 Backend server running on http://localhost:3000
```

**Keep this terminal open** - the backend must stay running.

### 3. Restart Frontend (if needed)

If your frontend is already running, you may need to restart it to load the new `.env` variables:

```bash
# Stop current server (Ctrl+C)
npm run dev
```

### 4. Test OAuth

1. Go to http://localhost:8081/login
2. Click "Continue with GitHub"
3. Authorize the app
4. You should be redirected back and logged in! 🎉

## Running Both Servers

You can run both frontend and backend together:

```bash
npm run dev:all
```

This starts both servers in one command.

## Troubleshooting

**"Backend API URL not configured"**
- Make sure `VITE_BACKEND_API_URL=http://localhost:3000` is in `.env`
- Restart frontend dev server

**"Invalid state parameter"**
- Clear browser cache/cookies
- Try a fresh login attempt
- Make sure you're not refreshing during OAuth flow

**Backend won't start**
- Check that `GITHUB_CLIENT_SECRET` is set in `.env`
- Make sure port 3000 is available
- Verify `npm install` completed successfully

