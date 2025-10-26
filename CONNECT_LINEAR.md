# How to Connect Your Linear Workspace

You've already added your Linear OAuth credentials! Here's how to complete the connection:

## ✅ What You've Already Done

You've configured OAuth credentials in `.env.local`:
- `LINEAR_CLIENT_ID`: 30cbea086793cf06d7c197faf6918407
- `LINEAR_CLIENT_SECRET`: 6f4cddc966f7bb1654882e6aae1023f6
- `LINEAR_REDIRECT_URI`: http://localhost:3000/api/auth/callback

## 🚀 Next Steps

### 1. Start the Development Server

```bash
npm run dev
```

The app will start at http://localhost:3000

### 2. Connect Your Linear Account

There are two ways to connect:

#### Option A: From the Landing Page
1. Open http://localhost:3000
2. Click **"Connect Linear"** button
3. You'll be redirected to Linear's OAuth page
4. Authorize the app
5. You'll be redirected back to the dashboard

#### Option B: From the Dashboard
1. Open http://localhost:3000/dashboard
2. Click **"Connect Linear"** in the top-right corner
3. Follow the OAuth flow
4. Return to dashboard with connection confirmed

### 3. Verify Connection

After connecting, you should see:
- ✅ Green "Connected" badge with your name
- ✅ Success message: "Successfully connected to Linear!"
- ✅ Your Linear teams and issues are now accessible via API

## 🔧 How OAuth Works

1. **Click "Connect Linear"** → Redirects to `/api/auth/login`
2. **OAuth Login Route** → Generates authorization URL and redirects to Linear
3. **Linear Authorization** → You approve the app on Linear's website
4. **Callback** → Linear redirects back to `/api/auth/callback?code=xxx`
5. **Token Exchange** → App exchanges code for access token
6. **Session Created** → Token stored in encrypted session cookie
7. **Dashboard** → You're redirected to dashboard with "connected=true"

## 🔐 Security Features

- ✅ **HttpOnly Cookies**: Session tokens not accessible to JavaScript
- ✅ **JWT Encryption**: Session data encrypted with HS256
- ✅ **CSRF Protection**: Random state parameter in OAuth flow
- ✅ **7-day Expiration**: Sessions automatically expire
- ✅ **Secure Flag**: Enabled in production mode

## 📊 What You Can Do After Connecting

### Fetch Teams
```bash
curl http://localhost:3000/api/linear/teams
```

Returns all your Linear teams:
```json
{
  "teams": [
    { "id": "team-123", "name": "Engineering", "key": "ENG" },
    { "id": "team-456", "name": "Design", "key": "DES" }
  ]
}
```

### Fetch Issues
```bash
curl "http://localhost:3000/api/linear/issues?teamId=team-123"
```

Returns all issues for that team:
```json
{
  "issues": [
    {
      "id": "issue-123",
      "title": "Implement user authentication",
      "description": "...",
      "state": "In Progress",
      "priority": 1,
      "estimate": 5
    }
  ]
}
```

## 🔄 Disconnect and Reconnect

To disconnect:
1. Click **"Disconnect"** button in the navbar
2. Session cleared, you'll need to reconnect

To reconnect:
1. Click **"Connect Linear"** again
2. Go through OAuth flow
3. New session created

## 🛠️ OAuth Flow Diagram

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │ 1. Click "Connect Linear"
       ▼
┌─────────────────────┐
│ /api/auth/login     │
│ Generate OAuth URL  │
└──────┬──────────────┘
       │ 2. Redirect
       ▼
┌─────────────────────┐
│ Linear.app          │
│ OAuth Authorization │
└──────┬──────────────┘
       │ 3. User approves
       ▼
┌─────────────────────┐
│ /api/auth/callback  │
│ Exchange code       │
│ Create session      │
└──────┬──────────────┘
       │ 4. Redirect
       ▼
┌─────────────────────┐
│ /dashboard          │
│ Connected! 🎉       │
└─────────────────────┘
```

## 🐛 Troubleshooting

### "OAuth failed" Error
- Check that your OAuth credentials are correct
- Ensure redirect URI matches exactly: `http://localhost:3000/api/auth/callback`
- Check Linear OAuth app settings at https://linear.app/settings/api

### "Not authenticated" API Errors
- Make sure you've connected via OAuth
- Check if session expired (7 days max)
- Try disconnecting and reconnecting

### Session Not Persisting
- Check that cookies are enabled in your browser
- Ensure you're using the same domain (localhost:3000)
- Check browser console for cookie errors

### CORS Issues
- Make sure redirect URI is exactly `http://localhost:3000/api/auth/callback`
- Don't use `127.0.0.1` - use `localhost`
- Check that Linear OAuth app has correct callback URL

## 📝 Environment Variables

Your `.env.local` should have:

```bash
# Linear OAuth (already configured)
LINEAR_CLIENT_ID=30cbea086793cf06d7c197faf6918407
LINEAR_CLIENT_SECRET=6f4cddc966f7bb1654882e6aae1023f6
LINEAR_REDIRECT_URI=http://localhost:3000/api/auth/callback

# Session secret (for JWT encryption)
SESSION_SECRET=your-random-secret-key-change-this-in-production

# Base URL (for redirects)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 🚀 Production Deployment

When deploying to production:

1. **Update Environment Variables**:
   ```bash
   LINEAR_REDIRECT_URI=https://yourdomain.com/api/auth/callback
   NEXT_PUBLIC_BASE_URL=https://yourdomain.com
   SESSION_SECRET=<generate-strong-random-secret>
   ```

2. **Update Linear OAuth App**:
   - Go to https://linear.app/settings/api
   - Edit your OAuth application
   - Add production redirect URI: `https://yourdomain.com/api/auth/callback`

3. **Enable Secure Cookies**:
   - Automatically enabled when `NODE_ENV=production`
   - Requires HTTPS

## 🎉 You're Ready!

Run `npm run dev` and click "Connect Linear" to get started!

Once connected, you can:
- ✅ Import tasks from Linear
- ✅ Fetch teams and projects
- ✅ Add PERT estimates to Linear issues
- ✅ Visualize project timelines

Enjoy your PERT estimator! 🚀
