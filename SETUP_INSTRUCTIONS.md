# Quick Setup Instructions

## Fix the GitHub OAuth Error

You're seeing this error because the `.env` file still has a placeholder Client ID.

### Step 1: Get Your GitHub Client ID

1. Go to https://github.com/settings/developers
2. Click "New OAuth App" (or edit existing one)
3. Fill in:
   - **Application name**: `BountyHub`
   - **Homepage URL**: `http://localhost:8081` (use the port your dev server shows)
   - **Authorization callback URL**: `http://localhost:8081/auth/callback` ⚠️ **Must match your actual port!**
4. Click "Register application"
5. **Copy the Client ID** (looks like: `Iv1.8a61f9b3a7aba766`)

### Step 2: Update .env File

Open the `.env` file in the project root and replace the placeholder:

```env
VITE_GITHUB_CLIENT_ID=your_actual_client_id_here
```

Replace `your_actual_client_id_here` with the Client ID you copied.

### Step 3: Check Your Port

**Important**: Your dev server is running on port **8081** (not 8080).

Make sure your GitHub OAuth App callback URL is set to:
```
http://localhost:8081/auth/callback
```

### Step 4: Restart Dev Server

After updating `.env`:
1. Stop the server (Ctrl+C)
2. Run `npm run dev` again
3. Vite needs a restart to load new environment variables

### Step 5: Test

1. Go to the login page
2. Click "Continue with GitHub"
3. You should be redirected to GitHub (not see an error)

## Troubleshooting

**"Client ID not configured" error:**
- Make sure `.env` file exists in project root
- Check that `VITE_GITHUB_CLIENT_ID` has your actual Client ID (not the placeholder)
- Restart the dev server

**"Callback URL mismatch" error:**
- The callback URL in GitHub OAuth App must match your dev server port exactly
- Check your terminal to see which port is being used
- Update GitHub OAuth App settings if needed

**Port confusion:**
- The code automatically uses `window.location.origin`, so it will use whatever port you're running on
- Just make sure the GitHub OAuth App callback URL matches that port

