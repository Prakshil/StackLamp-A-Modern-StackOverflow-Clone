# 🚀 StackLamp Deployment Guide

## Pre-Deployment Checklist

### 1. **Verify Environment Variables**
Ensure your `.env` file has all required variables:
```env
NEXT_PUBLIC_APPWRITE_HOST_URL=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_APPWRITE_API_KEY=your_api_key
NEXT_PUBLIC_APPWRITE_BUCKET_ID=attachments
```

### 2. **Test Locally**
```bash
npm run build
npm start
```
Visit http://localhost:3000 to ensure everything works in production mode.

---

## Deployment Options

## Option 1: Vercel (Recommended for Next.js) ⭐

### Steps:
1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/stackoverflow.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Add Environment Variables**
   - In Vercel dashboard → Settings → Environment Variables
   - Add all your `.env` variables:
     - `NEXT_PUBLIC_APPWRITE_HOST_URL`
     - `NEXT_PUBLIC_APPWRITE_PROJECT_ID`
     - `NEXT_APPWRITE_API_KEY`
     - `NEXT_PUBLIC_APPWRITE_BUCKET_ID`

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your site will be live at `your-project.vercel.app`

### Vercel CLI (Alternative):
```bash
npm i -g vercel
vercel login
vercel
# Follow prompts and add environment variables
```

---

## Option 2: Netlify

### Steps:
1. **Build Configuration**
   Create `netlify.toml`:
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

2. **Deploy**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub and select your repo
   - Add environment variables in Site settings → Environment variables
   - Deploy

---

## Option 3: Railway

### Steps:
1. **Go to [railway.app](https://railway.app)**
2. Click "Start a New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway auto-detects Next.js
5. Add environment variables in Variables tab
6. Deploy automatically

---

## Option 4: DigitalOcean App Platform

### Steps:
1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Create New App → GitHub
3. Select repository
4. Configure:
   - Build Command: `npm run build`
   - Run Command: `npm start`
5. Add environment variables
6. Launch app

---

## Option 5: Self-Hosted (VPS/Cloud Server)

### Requirements:
- Ubuntu/Debian server
- Node.js 18+ installed
- Domain name (optional)

### Steps:

1. **Install Node.js on server**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Install PM2 (Process Manager)**
   ```bash
   sudo npm install -g pm2
   ```

3. **Clone your repository**
   ```bash
   git clone https://github.com/yourusername/stackoverflow.git
   cd stackoverflow
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Create `.env` file**
   ```bash
   nano .env
   # Add all your environment variables
   ```

6. **Build the application**
   ```bash
   npm run build
   ```

7. **Start with PM2**
   ```bash
   pm2 start npm --name "stackoverflow" -- start
   pm2 save
   pm2 startup
   ```

8. **Setup Nginx (Reverse Proxy)**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/stackoverflow
   ```

   Add this configuration:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable the site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/stackoverflow /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

9. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

---

## Post-Deployment Steps

### 1. **Update Appwrite Settings**
   - Go to Appwrite Console
   - Project Settings → Platforms
   - Add your production domain:
     - Name: Production
     - Hostname: `your-domain.com` or `your-app.vercel.app`
   - This allows Appwrite API calls from your production domain

### 2. **Update CORS Settings**
   - In Appwrite Console → Settings
   - Add your production URL to allowed origins

### 3. **Test Everything**
   - ✅ User registration/login
   - ✅ Ask questions
   - ✅ File uploads
   - ✅ Voting system
   - ✅ Static questions display

### 4. **Monitor Performance**
   - Vercel: Built-in analytics
   - PM2: `pm2 monit` or `pm2 logs`

---

## Troubleshooting

### Build Fails
- Check Node.js version: `node -v` (should be 18+)
- Clear cache: `rm -rf .next node_modules && npm install`
- Check for TypeScript errors: `npm run build`

### Environment Variables Not Working
- Make sure variables start with `NEXT_PUBLIC_` for client-side access
- Restart deployment after adding variables
- Check variable names match exactly

### Appwrite Connection Issues
- Verify Appwrite platform settings include your production domain
- Check CORS settings in Appwrite
- Ensure API key has correct permissions

### 404 Errors on Routes
- Next.js should handle this automatically
- For self-hosted, ensure Nginx proxy configuration is correct

---

## Custom Domain Setup

### Vercel:
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

### Netlify:
1. Domain settings → Add custom domain
2. Update DNS records

---

## Recommended: Vercel Deployment (Easiest)

**Quick Deploy:**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables when prompted
# Or add them in Vercel dashboard later
```

Your site will be live in minutes! 🎉

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- Appwrite Docs: https://appwrite.io/docs

Good luck with your deployment! 🚀
