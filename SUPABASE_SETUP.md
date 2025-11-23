# Supabase Setup Guide

This project now uses **Supabase** for authentication and backend services. Supabase handles GitHub OAuth, rate limiting, security, and user management automatically.

## Why Supabase?

✅ **No custom backend needed** - Supabase handles OAuth flows  
✅ **Automatic rate limiting** - No more "Too many requests" errors  
✅ **Built-in security** - Industry-standard authentication  
✅ **User management** - Automatic user creation and session handling  
✅ **Database included** - Ready for storing bounties, payments, etc.  
✅ **Real-time features** - Built-in real-time subscriptions  

## Quick Setup

### Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click **"New Project"**
4. Fill in:
   - **Name**: `bounty-hub` (or your preferred name)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click **"Create new project"**
6. Wait 2-3 minutes for the project to initialize

### Step 2: Get Your Project Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys" → "anon public")

### Step 3: Configure GitHub OAuth in Supabase

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Find **GitHub** and click to enable it
3. You'll need:
   - **GitHub Client ID**: `Ov23lik2GgyOAg3BIaiV` (you already have this)
   - **GitHub Client Secret**: `a6c4fd2eb74ec31178232a9c8741eb7553bf5b8b` (you already have this)
4. **Redirect URL**: Supabase will show you the redirect URL. It should be something like:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```
5. **Update GitHub OAuth App**:
   - Go to [https://github.com/settings/developers](https://github.com/settings/developers)
   - Click your OAuth App
   - Update **Authorization callback URL** to the Supabase redirect URL shown above
   - Save changes

### Step 4: Update .env File

Update your `.env` file with Supabase credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Old GitHub OAuth (no longer needed, but keep for reference)
# VITE_GITHUB_CLIENT_ID=Ov23lik2GgyOAg3BIaiV
# VITE_BACKEND_API_URL=http://localhost:3000
# GITHUB_CLIENT_SECRET=a6c4fd2eb74ec31178232a9c8741eb7553bf5b8b
```

Replace:
- `your-project-ref` with your actual Supabase project reference
- `your_anon_key_here` with your actual anon/public key

### Step 5: Restart Development Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

## What Changed?

### ✅ Removed
- Custom Express backend server (`server.js`)
- Manual OAuth code exchange
- Rate limiting issues
- State parameter management

### ✅ Added
- Supabase client library
- Automatic OAuth handling
- Built-in session management
- Better error handling

## Testing

1. Go to http://localhost:8081/login
2. Click "Continue with GitHub"
3. Authorize the app
4. You should be redirected back and logged in! 🎉

## Troubleshooting

### "Supabase not configured"
- Make sure `.env` file has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart dev server after updating `.env`

### "Invalid redirect URI"
- Make sure GitHub OAuth App callback URL matches Supabase redirect URL
- Check Supabase dashboard → Authentication → Providers → GitHub → Redirect URL

### Still seeing old errors
- Clear browser cache and localStorage
- Make sure you restarted the dev server
- Check browser console for specific errors

## Next Steps

Now that authentication is working, you can:
- Store user data in Supabase database
- Create tables for bounties, payments, etc.
- Use Supabase real-time features for live updates
- Add more authentication providers if needed

## Need Help?

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [GitHub OAuth with Supabase](https://supabase.com/docs/guides/auth/social-login/auth-github)

