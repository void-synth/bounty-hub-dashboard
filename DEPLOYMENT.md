# Deployment Guide

## ✅ Your `.env` File is Safe

Your `.env` file is in `.gitignore`, so it **won't be pushed** to the repository. This is correct and secure! ✅

## 🚀 Deploying to Production

When you deploy (Vercel, Netlify, etc.), you need to configure environment variables in your hosting platform.

### Environment Variables Needed

```env
VITE_SUPABASE_URL=https://dxhqwwyygoigxdtiodgk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4aHF3d3l5Z29pZ3hkdGlvZGdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4NTk0OTYsImV4cCI6MjA3OTQzNTQ5Nn0.26QrA_WHSZ1EBSaqxsWSfxsHlaNuRF2qi29m5IgVOQE
```

### Platform-Specific Instructions

#### Vercel

1. Go to your project in Vercel dashboard
2. Go to **Settings** → **Environment Variables**
3. Add each variable:
   - `VITE_SUPABASE_URL` = `https://dxhqwwyygoigxdtiodgk.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4aHF3d3l5Z29pZ3hkdGlvZGdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4NTk0OTYsImV4cCI6MjA3OTQzNTQ5Nn0.26QrA_WHSZ1EBSaqxsWSfxsHlaNuRF2qi29m5IgVOQE`
4. Select **Production**, **Preview**, and **Development** environments
5. Click **Save**
6. Redeploy your application

#### Netlify

1. Go to your site in Netlify dashboard
2. Go to **Site configuration** → **Environment variables**
3. Click **Add variable**
4. Add each variable (same values as above)
5. Click **Save**
6. Trigger a new deploy

#### Other Platforms

For any other platform, add the environment variables in their settings/configuration section.

## 🔒 Important Security Notes

✅ **Good**: `.env` is in `.gitignore` - credentials won't be committed  
✅ **Good**: `.env.example` is included - shows what's needed without exposing secrets  
⚠️ **Important**: Never commit `.env` file with real credentials  
⚠️ **Important**: The anon key is safe to expose in frontend code (it's designed for that), but keep your service role key secret

## 🔄 Updating GitHub OAuth for Production

When deploying to production, you'll need to:

1. **Update Supabase Redirect URL** (if needed):
   - Go to Supabase dashboard → Authentication → URL Configuration
   - Add your production URL to allowed redirect URLs

2. **Update GitHub OAuth App**:
   - Go to https://github.com/settings/developers
   - Click your OAuth App
   - Add your production callback URL:
     ```
     https://your-production-domain.com/auth/callback
     ```
   - Or use Supabase's redirect URL if you're using it:
     ```
     https://dxhqwwyygoigxdtiodgk.supabase.co/auth/v1/callback
     ```

## ✅ Checklist Before Deploying

- [ ] Environment variables configured in hosting platform
- [ ] GitHub OAuth App callback URL updated for production
- [ ] Supabase redirect URLs configured (if needed)
- [ ] Test authentication flow in production
- [ ] Verify Supabase connection works

## 🎉 After Deployment

Your app will work exactly the same as in development, but with production URLs. The Supabase connection and GitHub OAuth will work seamlessly!

