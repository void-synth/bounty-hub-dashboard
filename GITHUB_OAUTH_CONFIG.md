# GitHub OAuth Configuration for Supabase

## ✅ Supabase Project Found

Your Supabase project "bounty" is already set up in **Shelby-classic's Org**!

- **Project ID**: `dxhqwwyygoigxdtiodgk`
- **Project URL**: `https://dxhqwwyygoigxdtiodgk.supabase.co`
- **Organization**: Shelby-classic's Org
- **Status**: ✅ ACTIVE_HEALTHY

## 📝 What You Need to Put in GitHub OAuth App

### Step 1: Configure GitHub Provider in Supabase

1. Go to: **https://supabase.com/dashboard/project/dxhqwwyygoigxdtiodgk/auth/providers**
2. Find **GitHub** in the list of providers
3. Click on it to open settings
4. **Enable** the GitHub provider
5. Enter these values:
   - **Client ID**: `Ov23lik2GgyOAg3BIaiV`
   - **Client Secret**: `a6c4fd2eb74ec31178232a9c8741eb7553bf5b8b`
6. **Save** the configuration

### Step 2: Get the Redirect URL from Supabase

After enabling GitHub in Supabase, you'll see a **Redirect URL** displayed. It should be:
```
https://dxhqwwyygoigxdtiodgk.supabase.co/auth/v1/callback
```

**Copy this exact URL** - you'll need it for GitHub!

### Step 3: Update GitHub OAuth App

1. Go to: **https://github.com/settings/developers**
2. Click on your OAuth App (Client ID: `Ov23lik2GgyOAg3BIaiV`)
3. Find **"Authorization callback URL"** field
4. **Replace** the current callback URL with the Supabase redirect URL:
   ```
   https://dxhqwwyygoigxdtiodgk.supabase.co/auth/v1/callback
   ```
5. Click **"Update application"** to save

## ✅ Summary

**In Supabase Dashboard:**
- Enable GitHub provider
- Client ID: `Ov23lik2GgyOAg3BIaiV`
- Client Secret: `a6c4fd2eb74ec31178232a9c8741eb7553bf5b8b`

**In GitHub OAuth App:**
- Authorization callback URL: `https://dxhqwwyygoigxdtiodgk.supabase.co/auth/v1/callback`

## 🚀 After Configuration

1. Restart your dev server:
   ```bash
   npm run dev
   ```

2. Test authentication:
   - Go to http://localhost:8081/login
   - Click "Continue with GitHub"
   - Should work perfectly! 🎉

## 📋 Your .env File

Your `.env` file has been updated with:
```env
VITE_SUPABASE_URL=https://dxhqwwyygoigxdtiodgk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4aHF3d3l5Z29pZ3hkdGlvZGdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4NTk0OTYsImV4cCI6MjA3OTQzNTQ5Nn0.26QrA_WHSZ1EBSaqxsWSfxsHlaNuRF2qi29m5IgVOQE
```

Everything is ready! Just configure GitHub in Supabase and update the callback URL in GitHub.
