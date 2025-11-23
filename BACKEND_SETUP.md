# Backend Server Setup

## Quick Start

The backend server is required for GitHub OAuth to work. It securely exchanges the OAuth code for an access token.

### Step 1: Install Dependencies

```bash
npm install
```

This will install `express`, `cors`, and `dotenv`.

### Step 2: Get Your GitHub Client Secret

1. Go to https://github.com/settings/developers
2. Click on your OAuth App (the one with Client ID: `Ov23lik2GgyOAg3BIaiV`)
3. Click **"Generate a new client secret"**
4. **Copy the Client Secret immediately** (you can only see it once!)

### Step 3: Update .env File

Add your Client Secret to the `.env` file:

```env
GITHUB_CLIENT_SECRET=your_actual_client_secret_here
```

Replace `your_actual_client_secret_here` with the secret you just copied.

### Step 4: Start the Backend Server

In a **new terminal window**, run:

```bash
npm run dev:backend
```

Or manually:
```bash
node server.js
```

You should see:
```
🚀 Backend server running on http://localhost:3000
📝 Make sure GITHUB_CLIENT_SECRET is set in .env file
🔗 Frontend should set VITE_BACKEND_API_URL=http://localhost:3000
```

### Step 5: Start the Frontend (if not already running)

In another terminal:

```bash
npm run dev
```

### Step 6: Test

1. Go to http://localhost:8081/login
2. Click "Continue with GitHub"
3. Authorize the app
4. You should be redirected back and logged in!

## Running Both Servers Together

You can run both servers with one command:

```bash
npm run dev:all
```

(Requires `concurrently` package - install with `npm install -D concurrently`)

## Troubleshooting

### "Backend API URL not configured"
- Make sure `VITE_BACKEND_API_URL=http://localhost:3000` is in your `.env` file
- Restart the frontend dev server after updating `.env`

### "Invalid state parameter"
- This can happen if you refresh the page during OAuth flow
- Try clearing browser cache/cookies
- Make a fresh login attempt

### Backend server won't start
- Make sure port 3000 is not already in use
- Check that `GITHUB_CLIENT_SECRET` is set in `.env`
- Make sure you've run `npm install`

### "Failed to exchange code for token"
- Verify `GITHUB_CLIENT_SECRET` is correct in `.env`
- Make sure the backend server is running
- Check that the Client ID and Secret match your GitHub OAuth App

## Security Notes

⚠️ **Important**:
- Never commit `.env` file (already in `.gitignore`)
- Never expose `GITHUB_CLIENT_SECRET` to the frontend
- The Client Secret should ONLY be used in the backend server
- In production, use environment variables on your hosting platform

