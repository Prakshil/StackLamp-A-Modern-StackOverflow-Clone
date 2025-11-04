# OAuth Configuration Guide

## Error: redirect_uri_mismatch

This error occurs when the redirect URI in your code doesn't match what's configured in Appwrite.

## Fix Steps

### 1. Go to Appwrite Console
Visit: https://cloud.appwrite.io/

### 2. Navigate to Your Project
- Select your `stackoverflow` project
- Click on **Auth** in the left sidebar

### 3. Configure Google OAuth

1. Click on **Settings** under OAuth2 Providers
2. Find **Google** in the list
3. Enable it if not already enabled
4. Add these **Redirect URLs** (one per line):

   **For local development:**
   ```
   http://localhost:3000/
   http://localhost:3000/login
   http://localhost:3000/register
   ```

   **For production (when you deploy):**
   ```
   https://yourdomain.com/
   https://yourdomain.com/login
   https://yourdomain.com/register
   ```

5. Click **Update** to save

### 4. Clear Browser Cache
- Clear cookies and cache for localhost
- Or try in an incognito/private window

### 5. Test Again
- Go to http://localhost:3000/login
- Click "Google" button
- Should now work without redirect_uri_mismatch error

## How OAuth Works in This App

```javascript
// When user clicks Google button:
account.createOAuth2Session(
    "google",
    "http://localhost:3000/",      // Success redirect (after login)
    "http://localhost:3000/login"  // Failure redirect (if cancelled/error)
);
```

The success URL must be added to your Appwrite OAuth settings!

## Troubleshooting

### Still getting error?
1. Double-check the URLs match exactly (including trailing slashes)
2. Make sure Google OAuth is enabled in Appwrite
3. Verify you have Google Client ID and Secret configured in Appwrite
4. Try logging out of Google and back in

### Need Google OAuth Credentials?
If you haven't set up Google OAuth credentials yet:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Set Authorized redirect URIs to:
   ```
   https://fra.cloud.appwrite.io/v1/account/sessions/oauth2/callback/google/YOUR_PROJECT_ID
   ```
6. Copy Client ID and Client Secret
7. Paste them in your Appwrite Google OAuth settings

## Current Code (Fixed)

**Login Page:**
```typescript
onClick={() => {
    const successUrl = `${window.location.origin}/`;
    const failureUrl = `${window.location.origin}/login`;
    account.createOAuth2Session("google", successUrl, failureUrl);
}}
```

**Register Page:**
```typescript
onClick={() => {
    const successUrl = `${window.location.origin}/`;
    const failureUrl = `${window.location.origin}/register`;
    account.createOAuth2Session("google", successUrl, failureUrl);
}}
```

These will automatically use:
- `http://localhost:3000/` in development
- Your production domain when deployed

---

After following these steps, Google OAuth should work perfectly! 🎉
