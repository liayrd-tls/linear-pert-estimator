# Production Deployment Guide - pert.liyard.cloud

## 🚨 Current Issue: OAuth Redirect URI Not Configured

You're seeing this error:
```
Invalid redirect_uri parameter for the application.
```

This happens because Linear doesn't recognize `https://pert.liyard.cloud/api/auth/callback` as a valid redirect URI.

---

## ✅ Step-by-Step Fix

### Step 1: Update Linear OAuth Application

1. **Go to Linear Settings**: https://linear.app/settings/api

2. **Find your OAuth application**:
   - Look for the app with Client ID: `30cbea086793cf06d7c197faf6918407`
   - Click **"Edit"** or the settings icon

3. **Add Production Redirect URI**:
   - In the "Redirect URIs" or "Callback URLs" section
   - Click **"Add redirect URI"** or similar button
   - Enter: `https://pert.liyard.cloud/api/auth/callback`
   - Keep the existing: `http://localhost:3000/api/auth/callback` (for local dev)
   - **Save** the changes

4. **Verify the settings**:
   - Client ID: `30cbea086793cf06d7c197faf6918407`
   - Client Secret: `6f4cddc966f7bb1654882e6aae1023f6`
   - Redirect URIs should include BOTH:
     - `http://localhost:3000/api/auth/callback` (local)
     - `https://pert.liyard.cloud/api/auth/callback` (production)

### Step 2: Rebuild and Redeploy

After updating Linear settings:

```bash
# Build the application
npm run build

# Deploy to your hosting (method depends on your setup)
# For example, if using Vercel:
vercel --prod

# Or if deploying manually:
npm start
```

### Step 3: Test the OAuth Flow

1. Visit: https://pert.liyard.cloud
2. Click **"Connect Linear"**
3. You should be redirected to Linear's authorization page
4. Click **"Authorize"**
5. You'll be redirected back to: `https://pert.liyard.cloud/dashboard?connected=true`
6. You should see a green "Connected" badge

---

## 🔧 What I Fixed

### 1. CORS Headers
Added proper CORS configuration in `next.config.ts`:
- `Access-Control-Allow-Origin`: Set to your domain
- `Access-Control-Allow-Credentials`: Enabled for cookies
- `Access-Control-Allow-Methods`: GET, POST, OPTIONS
- Security headers: X-Frame-Options, X-Content-Type-Options, etc.

### 2. Environment Variables
Your `.env.local` is correctly configured for production:
```bash
LINEAR_CLIENT_ID=30cbea086793cf06d7c197faf6918407
LINEAR_CLIENT_SECRET=6f4cddc966f7bb1654882e6aae1023f6
LINEAR_REDIRECT_URI=https://pert.liyard.cloud/api/auth/callback
SESSION_SECRET=dj3012fe9dm1po1291djmosdkx8127hs18nss91
NEXT_PUBLIC_BASE_URL=https://pert.liyard.cloud
```

**⚠️ Important**: Make sure these environment variables are set on your production server!

---

## 🔐 Security Checklist for Production

- ✅ HTTPS enabled (pert.liyard.cloud)
- ✅ Session secret is strong and random
- ✅ HttpOnly cookies enabled
- ✅ Secure cookie flag (automatic in production)
- ✅ CORS headers configured
- ✅ Security headers added
- ⚠️ **TODO**: Update Linear OAuth app with production redirect URI

---

## 🐛 Common Issues & Solutions

### Issue: "Invalid redirect_uri" Error
**Cause**: Production redirect URI not added to Linear OAuth app
**Solution**: Follow Step 1 above - add `https://pert.liyard.cloud/api/auth/callback` in Linear settings

### Issue: CORS Errors
**Cause**: Browser blocking cross-origin requests
**Solution**: Already fixed in `next.config.ts` - redeploy the app

### Issue: "Not authenticated" After Login
**Cause**: Cookies not being set correctly
**Solution**:
- Ensure HTTPS is working
- Check that `NEXT_PUBLIC_BASE_URL` matches your domain
- Verify `Secure` cookie flag is set in production

### Issue: Session Expires Too Quickly
**Cause**: Default 7-day expiration
**Solution**: Adjust in `lib/auth/session.ts:26` - change `.setExpirationTime('7d')` to longer if needed

---

## 📋 Deployment Platforms

### Vercel (Recommended)
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel --prod

# 3. Set environment variables in Vercel dashboard
# Go to: Settings → Environment Variables
# Add all variables from .env.local
```

### Netlify
```bash
# 1. Install Netlify CLI
npm i -g netlify-cli

# 2. Build
npm run build

# 3. Deploy
netlify deploy --prod

# 4. Set environment variables in Netlify dashboard
```

### Docker (Self-hosted)
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t linear-pert-estimator .
docker run -p 3000:3000 --env-file .env.local linear-pert-estimator
```

### Traditional Server (PM2)
```bash
# 1. Build
npm run build

# 2. Install PM2
npm i -g pm2

# 3. Start with PM2
pm2 start npm --name "linear-pert" -- start

# 4. Save PM2 config
pm2 save
pm2 startup
```

---

## 🔄 OAuth Flow Diagram (Production)

```
User visits: https://pert.liyard.cloud
       ↓
Click "Connect Linear"
       ↓
Redirect to: https://pert.liyard.cloud/api/auth/login
       ↓
Generate OAuth URL with production redirect URI
       ↓
Redirect to: https://linear.app/oauth/authorize?
  client_id=30cbea086793cf06d7c197faf6918407
  redirect_uri=https://pert.liyard.cloud/api/auth/callback
  response_type=code
  scope=read,write
       ↓
User clicks "Authorize" on Linear
       ↓
Linear redirects to: https://pert.liyard.cloud/api/auth/callback?code=xxx
       ↓
App exchanges code for access token
       ↓
Create session with JWT
       ↓
Set secure cookie (Secure=true, HttpOnly=true, SameSite=Lax)
       ↓
Redirect to: https://pert.liyard.cloud/dashboard?connected=true
       ↓
✅ Success! User is connected
```

---

## 📝 Environment Variable Reference

| Variable | Local Development | Production |
|----------|------------------|------------|
| `LINEAR_CLIENT_ID` | Same | Same |
| `LINEAR_CLIENT_SECRET` | Same | Same |
| `LINEAR_REDIRECT_URI` | `http://localhost:3000/api/auth/callback` | `https://pert.liyard.cloud/api/auth/callback` |
| `SESSION_SECRET` | Any random string | **Strong random secret** |
| `NEXT_PUBLIC_BASE_URL` | `http://localhost:3000` | `https://pert.liyard.cloud` |
| `NODE_ENV` | `development` | `production` |

---

## ✅ Post-Deployment Checklist

After deploying:

- [ ] Linear OAuth app has production redirect URI
- [ ] All environment variables set on production server
- [ ] HTTPS is working correctly
- [ ] Can visit https://pert.liyard.cloud and see the landing page
- [ ] "Connect Linear" button redirects to Linear
- [ ] OAuth authorization works
- [ ] Redirected back to dashboard after authorization
- [ ] "Connected" badge appears
- [ ] Can fetch teams: `curl https://pert.liyard.cloud/api/linear/teams`
- [ ] Session persists across page refreshes
- [ ] "Disconnect" button works

---

## 🚀 Next Steps

Once OAuth is working:

1. **Test the full flow**: Connect → Fetch teams → Fetch issues
2. **Add database**: Store PERT estimates persistently
3. **Build project views**: Display multiple tasks with aggregated PERT
4. **Add export features**: PDF/CSV reports
5. **Monitor errors**: Set up error tracking (Sentry, etc.)
6. **Performance**: Add caching, optimize API calls

---

## 🆘 Still Having Issues?

If you're still getting errors after following these steps:

1. **Check Linear OAuth App**:
   - Verify redirect URI is exactly: `https://pert.liyard.cloud/api/auth/callback`
   - No trailing slashes
   - HTTPS, not HTTP
   - Matches `LINEAR_REDIRECT_URI` in .env.local

2. **Check Browser Console**:
   - Look for CORS errors
   - Check Network tab for failed requests
   - Verify cookies are being set

3. **Check Server Logs**:
   - Look for OAuth errors
   - Check session creation logs
   - Verify environment variables are loaded

4. **Test Locally First**:
   - Use `http://localhost:3000` temporarily
   - Verify OAuth works locally
   - Then switch to production domain

---

**The main fix**: Add `https://pert.liyard.cloud/api/auth/callback` to your Linear OAuth application settings! 🔧
