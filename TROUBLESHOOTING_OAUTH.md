# Troubleshooting OAuth Errors

## Current Errors Fixed

✅ **State Parameter Issue** - Made more lenient for development  
✅ **Better Error Messages** - Backend now logs detailed information  
✅ **Improved Error Handling** - Frontend shows specific error messages  

## Common Issues & Solutions

### Error: "Invalid state parameter"

**Cause**: The state stored when redirecting to GitHub doesn't match the state returned.

**Solutions**:
1. **Clear browser storage**:
   - Open DevTools (F12)
   - Go to Application tab
   - Clear Local Storage and Session Storage
   - Try logging in again

2. **Don't refresh during OAuth flow**:
   - Complete the entire flow without refreshing
   - If you refresh, the state will be lost

3. **The fix I made**: The code now allows authentication even if state is missing (development mode only)

### Error: "400 Bad Request" from Backend

**Cause**: The backend is rejecting the code exchange. Common reasons:

1. **Client Secret not set or wrong**:
   ```bash
   # Check your .env file
   GITHUB_CLIENT_SECRET=your_actual_secret_here
   ```
   - Get it from: https://github.com/settings/developers
   - Click your OAuth App → "Generate a new client secret"
   - Copy it immediately (you can only see it once!)

2. **Redirect URI mismatch**:
   - Your GitHub OAuth App callback URL must match exactly
   - Check what port your frontend uses (8080 or 8081)
   - Update GitHub OAuth App callback URL to: `http://localhost:8081/auth/callback` (or 8080)
   - The redirect_uri in the code must match exactly

3. **Code already used or expired**:
   - OAuth codes can only be used once
   - They expire quickly (usually within 10 minutes)
   - Solution: Try a fresh login

4. **Backend not running**:
   ```bash
   # Check if backend is running
   npm run dev:backend
   ```
   - Should see: `🚀 Backend server running on http://localhost:3000`

### Error: "Failed to exchange code for token"

**Check the backend terminal** - it now logs detailed information:
- ✅ Code received
- ✅ Client ID/Secret status
- ✅ GitHub API response
- ❌ Any errors

**Steps to debug**:
1. Open backend terminal (where `npm run dev:backend` is running)
2. Look for error messages starting with ❌
3. Check the "GitHub response" log
4. Common issues:
   - `bad_verification_code` → Code expired or already used
   - `redirect_uri_mismatch` → Callback URL doesn't match
   - `incorrect_client_credentials` → Client Secret is wrong

## Step-by-Step Debugging

### 1. Verify Backend is Running

```bash
# In a terminal, run:
npm run dev:backend
```

You should see:
```
🚀 Backend server running on http://localhost:3000
📝 Make sure GITHUB_CLIENT_SECRET is set in .env file
🔗 Frontend should set VITE_BACKEND_API_URL=http://localhost:3000
```

### 2. Check .env File

Make sure these are set:
```env
VITE_GITHUB_CLIENT_ID=Ov23lik2GgyOAg3BIaiV
VITE_BACKEND_API_URL=http://localhost:3000
GITHUB_CLIENT_SECRET=your_actual_secret_here
```

### 3. Verify GitHub OAuth App Settings

1. Go to: https://github.com/settings/developers
2. Click your OAuth App
3. Check:
   - **Client ID**: Should match `Ov23lik2GgyOAg3BIaiV`
   - **Authorization callback URL**: Should be `http://localhost:8081/auth/callback` (or 8080, depending on your frontend port)
   - **Client Secret**: Should match what's in your `.env` file

### 4. Check Backend Logs

When you try to log in, the backend terminal will show:
```
📥 Received OAuth callback request
   Code: present
   Redirect URI: http://localhost:8081/auth/callback
   Client ID: present
   Client Secret: present
🔄 Exchanging code for token...
📤 GitHub response status: 200
✅ Token exchange successful
```

If you see errors (❌), check what they say.

### 5. Clear Everything and Try Again

1. Stop both servers (Ctrl+C)
2. Clear browser storage (DevTools → Application → Clear storage)
3. Update `.env` with correct Client Secret
4. Start backend: `npm run dev:backend`
5. Start frontend: `npm run dev`
6. Try logging in again

## Quick Test

1. **Backend health check**:
   ```bash
   curl http://localhost:3000/health
   ```
   Should return: `{"status":"ok","message":"Backend server is running"}`

2. **Check if Client Secret is loaded**:
   - Look at backend terminal when it starts
   - If you see "Client Secret: present", it's loaded
   - If missing, check `.env` file

## Still Having Issues?

1. **Check backend terminal** - it now has detailed logging
2. **Check browser console** - look for specific error messages
3. **Verify all URLs match**:
   - GitHub OAuth App callback URL
   - Frontend redirect URI
   - Backend redirect_uri parameter

The backend now provides much more detailed error information, so check the terminal output!

