# GitHub OAuth Setup Guide

This application uses GitHub OAuth for authentication. Follow these steps to set it up:

## Step 1: Create GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the form:
   - **Application name**: BountyHub (or your preferred name)
   - **Homepage URL**: `http://localhost:8080` (or whatever port your dev server uses - check the terminal output)
   - **Authorization callback URL**: `http://localhost:8080/auth/callback` (or `http://localhost:8081/auth/callback` if using port 8081 - **must match your actual dev server port**)
   
   ⚠️ **Important**: The callback URL port must exactly match the port your development server is running on. Check your terminal when you run `npm run dev` to see which port is being used.
4. Click "Register application"
5. Copy the **Client ID** (you'll need this)

## Step 2: Configure Environment Variables

Create a `.env` file in the root directory:

```env
# GitHub OAuth Configuration
VITE_GITHUB_CLIENT_ID=your_github_client_id_here

# Backend API URL (optional - for production)
# If not set, the app will work in frontend-only mode (development)
VITE_BACKEND_API_URL=http://localhost:3000
```

Replace `your_github_client_id_here` with the Client ID you copied from GitHub.

## Step 3: Backend Setup (Required for Production)

⚠️ **Important**: The OAuth code exchange requires a backend server for security reasons. GitHub does not allow direct client-side code exchange.

### Option A: Use Your Backend API

If you have a backend API, create an endpoint at `/api/auth/github/callback` that:
1. Receives the OAuth code
2. Exchanges it for an access token using your GitHub Client Secret
3. Returns the access token to the frontend

Example backend endpoint (Node.js/Express):
```javascript
app.post('/api/auth/github/callback', async (req, res) => {
  const { code, redirect_uri } = req.body;
  
  // Exchange code for token
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri,
    }),
  });
  
  const data = await response.json();
  res.json({ access_token: data.access_token });
});
```

### Option B: Development Mode (Frontend-Only)

For development/testing, you can use a mock implementation, but **this should never be used in production**.

## Step 4: Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to the login page
3. Click "Continue with GitHub"
4. You should be redirected to GitHub for authorization
5. After authorizing, you'll be redirected back to `/auth/callback`
6. The app will complete authentication and redirect to the dashboard

## Troubleshooting

### "GitHub Client ID not configured"
- Make sure you created a `.env` file
- Check that `VITE_GITHUB_CLIENT_ID` is set correctly
- Restart your development server after changing `.env`

### "Backend API URL not configured"
- This is expected if you're in development mode
- For production, set `VITE_BACKEND_API_URL` to your backend API URL
- The backend must have an endpoint at `/api/auth/github/callback`

### "Invalid state parameter"
- This usually means the OAuth flow was interrupted
- Try clearing your browser cache and cookies
- Make sure you're not blocking cookies or JavaScript

### Callback URL mismatch
- Make sure the callback URL in your GitHub OAuth App matches exactly
- **Check which port your dev server is using** - look at the terminal output when you run `npm run dev`
- Common ports: `http://localhost:8080/auth/callback` or `http://localhost:8081/auth/callback`
- The port in the callback URL must match the port shown in your browser URL
- For production: `https://yourdomain.com/auth/callback`

## Security Notes

1. **Never commit your `.env` file** - it's already in `.gitignore`
2. **Never expose your Client Secret** - it should only be used on the backend
3. **Use HTTPS in production** - OAuth requires secure connections
4. **Validate state parameter** - already implemented for CSRF protection

