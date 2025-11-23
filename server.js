/**
 * Simple Backend Server for GitHub OAuth
 * 
 * This server handles the OAuth code exchange securely.
 * 
 * To run: node server.js
 * 
 * Make sure to set GITHUB_CLIENT_SECRET in your .env file
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:8081', 'http://127.0.0.1:8080', 'http://127.0.0.1:8081'],
  credentials: true
}));
app.use(express.json());

// GitHub OAuth callback endpoint
app.post('/api/auth/github/callback', async (req, res) => {
  try {
    const { code, redirect_uri } = req.body;
    const clientId = process.env.VITE_GITHUB_CLIENT_ID || process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    console.log('📥 Received OAuth callback request');
    console.log('   Code:', code ? 'present' : 'missing');
    console.log('   Redirect URI:', redirect_uri);
    console.log('   Client ID:', clientId ? 'present' : 'missing');
    console.log('   Client Secret:', clientSecret ? 'present' : 'missing');

    if (!clientId || !clientSecret) {
      console.error('❌ Missing configuration');
      return res.status(500).json({ 
        error: 'GitHub OAuth not configured. Missing CLIENT_ID or CLIENT_SECRET',
        details: {
          hasClientId: !!clientId,
          hasClientSecret: !!clientSecret
        }
      });
    }

    if (!code) {
      console.error('❌ Missing authorization code');
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    // Use the redirect_uri from request, or default to common ports
    const finalRedirectUri = redirect_uri || `http://localhost:8081/auth/callback`;
    
    console.log('🔄 Exchanging code for token...');
    console.log('   Using redirect_uri:', finalRedirectUri);

    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: finalRedirectUri,
      }),
    });

    const responseText = await tokenResponse.text();
    console.log('📤 GitHub response status:', tokenResponse.status);
    console.log('📤 GitHub response:', responseText);

    if (!tokenResponse.ok) {
      console.error('❌ GitHub token exchange failed');
      return res.status(500).json({ 
        error: 'Failed to exchange code for token',
        details: responseText
      });
    }

    let tokenData;
    try {
      tokenData = JSON.parse(responseText);
    } catch (e) {
      console.error('❌ Failed to parse GitHub response:', e);
      return res.status(500).json({ 
        error: 'Invalid response from GitHub',
        details: responseText
      });
    }

    if (tokenData.error) {
      console.error('❌ GitHub returned error:', tokenData.error);
      return res.status(400).json({ 
        error: tokenData.error_description || tokenData.error,
        error_code: tokenData.error
      });
    }

    if (!tokenData.access_token) {
      console.error('❌ No access token in response');
      return res.status(500).json({ 
        error: 'No access token received from GitHub',
        details: tokenData
      });
    }

    console.log('✅ Token exchange successful');
    
    // Return access token to frontend
    res.json({ 
      access_token: tokenData.access_token,
      token_type: tokenData.token_type || 'bearer',
      scope: tokenData.scope
    });

  } catch (error) {
    console.error('❌ OAuth callback error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📝 Make sure GITHUB_CLIENT_SECRET is set in .env file`);
  console.log(`🔗 Frontend should set VITE_BACKEND_API_URL=http://localhost:${PORT}`);
});

