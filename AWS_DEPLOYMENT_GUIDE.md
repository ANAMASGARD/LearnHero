# 🚀 Complete AWS Amplify Deployment Guide

## Why AWS Amplify?

AWS Amplify is the **best alternative to GCP Cloud Run** for Next.js applications because:
- ✅ **GitHub Integration**: Just like GCP, connect your repo and auto-deploy
- ✅ **Automatic Builds**: Deploys on every push to your branch
- ✅ **Free Tier**: Generous free tier for hosting
- ✅ **Easy Setup**: No complex configuration needed
- ✅ **Built for Next.js**: Optimized for Next.js applications

---

## 📋 Prerequisites

1. ✅ AWS Account (you have this)
2. ✅ GitHub repository with your code
3. ✅ All environment variables ready

---

## 🚀 Step-by-Step Deployment Process

### Step 1: Push Your Code to GitHub

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create GitHub Repository**:
   - Go to [GitHub](https://github.com/new)
   - Create a new repository (e.g., `LearnHero`)
   - **DO NOT** initialize with README, .gitignore, or license

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/LearnHero.git
   git branch -M main
   git push -u origin main
   ```

---

### Step 2: Connect to AWS Amplify

1. **Go to AWS Amplify Console**:
   - Visit: https://ap-southeast-1.console.aws.amazon.com/amplify/home?region=ap-southeast-1
   - Or go to: https://console.aws.amazon.com/amplify/

2. **Click "New app" → "Host web app"**

3. **Connect Repository**:
   - Select **GitHub** as your source
   - Click "Authorize" if prompted
   - Select your repository: `LearnHero`
   - Select branch: `main` (or your default branch)
   - Click **"Next"**

---

### Step 3: Configure Build Settings

AWS Amplify should auto-detect Next.js, but verify these settings:

**Build Settings:**
```
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

**If auto-detection doesn't work, click "Edit" and paste the above YAML.**

**Important Settings:**
- **App name**: `LearnHero` (or your choice)
- **Environment**: `main` (or your branch name)
- **Node version**: `18.x` or `20.x` (select from dropdown)

Click **"Next"**

---

### Step 4: Add Environment Variables (CRITICAL!)

This is where most deployments fail! Add ALL these variables:

1. **Click "Advanced settings"** or scroll to "Environment variables"

2. **Add each variable one by one**:

#### Clerk Authentication:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_test_ZXF1aXBwZWQtbGVtbWluZy02My5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY = sk_test_7AsqCCswrjsJ5OCSwzBcpHZgtUS4C373FFJOZWwIDe
```

#### Clerk URLs:
```
NEXT_PUBLIC_CLERK_SIGN_IN_URL = /sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL = /sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL = /workspace
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL = /workspace
```

#### Database:
```
DATABASE_URL = postgresql://neondb_owner:npg_Je5auD0IMmzo@ep-soft-unit-a1kkvvwn-pooler.ap-southeast-1.aws.neon.tech/LearnHero?sslmode=require&channel_binding=require
NEXT_PUBLIC_DATABASE_URL = postgresql://neondb_owner:npg_Je5auD0IMmzo@ep-soft-unit-a1kkvvwn-pooler.ap-southeast-1.aws.neon.tech/LearnHero?sslmode=require&channel_binding=require
```

#### Google AI:
```
GOOGLE_GEN_AI_API_KEY = AIzaSyBDwhayHpc-NgI8HEDq__yPxCTvZ2WTklg
NEXT_PUBLIC_GEMINI_API_KEY = AIzaSyBDwhayHpc-NgI8HEDq__yPxCTvZ2WTklg
GEMINI_API_KEY = AIzaSyBDwhayHpc-NgI8HEDq__yPxCTvZ2WTklg
```

#### Vapi.ai:
```
VAPI_PRIVATE_KEY = e2dc81db-45a9-4e43-bd73-a79357477f35
NEXT_PUBLIC_VAPI_API_KEY = 0ebef6f9-ecd3-48e2-a47a-780105a6b30d
```

#### Stripe (Billing):
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_test_51SZBDQGwSq867TfUakTJJXDNRGz5XIageZfQx9DbLZM1gOPaiM2w7xZdMfaSVnA4LV8ewclWsn49E4bIqXhp7RlY00Ex0dAGzq
STRIPE_SECRET_KEY = sk_test_51SZBDQGwSq867TfUoUfxxMYzQsgBKvNEy0ZbJJc6KEU9e9Pd8nKqNtYafpCG2Pvn8EW7LbBJb1aapa6wIi6UhIzs00Fo86PZgi
STRIPE_PRO_PRICE_ID = (leave empty for now, add later)
STRIPE_WEBHOOK_SECRET = (leave empty for now, add later)
```

#### Unsplash:
```
UNSPLASH_ACCESS_KEY = 7h33Q4MMPPnVWSW6jJDgz2XUM3dpja-jGnOdAFR-AYQ
```

#### App URL:
```
NEXT_PUBLIC_BASE_URL = https://YOUR_AMPLIFY_URL.amplifyapp.com
NEXT_PUBLIC_APP_URL = https://YOUR_AMPLIFY_URL.amplifyapp.com
```

**Note**: Replace `YOUR_AMPLIFY_URL` with your actual Amplify URL after first deployment.

---

### Step 5: Review and Deploy

1. **Review all settings**
2. **Click "Save and deploy"**
3. **Wait for build to complete** (5-10 minutes)

---

## 🔧 Troubleshooting Deployment Issues

### Issue 1: Build Fails Immediately

**Possible Causes:**
- Missing environment variables
- Wrong Node version
- Build command incorrect

**Solution:**
1. Check build logs in Amplify Console
2. Look for specific error messages
3. Verify all environment variables are added
4. Try Node version 18.x or 20.x

### Issue 2: "Module not found" Errors

**Solution:**
- Make sure `package.json` has all dependencies
- Check that `npm ci` runs successfully
- Verify `node_modules` is in `.gitignore`

### Issue 3: Environment Variables Not Working

**Solution:**
- Make sure variables start with `NEXT_PUBLIC_` for client-side
- Check for typos in variable names
- Restart build after adding variables

### Issue 4: Database Connection Errors

**Solution:**
- Verify `DATABASE_URL` is correct
- Check if database allows connections from AWS IPs
- For Neon, make sure connection string is correct

### Issue 5: Clerk Authentication Not Working

**Solution:**
- Update Clerk dashboard with Amplify URL:
  - Go to Clerk Dashboard → Paths
  - Add Amplify URL to allowed origins
  - Update redirect URLs

---

## 📝 Post-Deployment Steps

### 1. Update Clerk Settings

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Navigate to **Paths** → **Allowed origins**
3. Add your Amplify URL: `https://YOUR_APP.amplifyapp.com`
4. Update redirect URLs to use Amplify URL

### 2. Update Stripe Webhook

1. Get your Amplify URL (e.g., `https://main.abc123.amplifyapp.com`)
2. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
3. Add webhook endpoint: `https://YOUR_APP.amplifyapp.com/api/subscription/webhook`
4. Copy webhook secret
5. Add `STRIPE_WEBHOOK_SECRET` to Amplify environment variables

### 3. Update App URL Environment Variable

1. After first deployment, copy your Amplify URL
2. Go to Amplify Console → App settings → Environment variables
3. Update:
   - `NEXT_PUBLIC_BASE_URL` = `https://YOUR_APP.amplifyapp.com`
   - `NEXT_PUBLIC_APP_URL` = `https://YOUR_APP.amplifyapp.com`
4. Redeploy

---

## 🎯 Quick Checklist

Before deploying, make sure:

- [ ] Code is pushed to GitHub
- [ ] `amplify.yml` file exists in root directory
- [ ] All environment variables are ready
- [ ] Database is accessible from AWS
- [ ] Clerk keys are ready
- [ ] Stripe keys are ready
- [ ] Node version is set (18.x or 20.x)

---

## 🚨 Common Build Errors & Fixes

### Error: "Cannot find module"
**Fix**: Make sure all dependencies are in `package.json`

### Error: "Build command failed"
**Fix**: Check build logs, usually missing env variable

### Error: "Database connection timeout"
**Fix**: Check DATABASE_URL and database firewall settings

### Error: "Clerk authentication failed"
**Fix**: Update Clerk dashboard with Amplify URL

---

## 📞 Need Help?

If deployment still fails:
1. Check build logs in Amplify Console
2. Look for specific error messages
3. Verify all environment variables
4. Make sure `amplify.yml` is in root directory

---

## 🎉 Success!

Once deployed, you'll get a URL like:
`https://main.abc123def456.amplifyapp.com`

Your app is now live on AWS! 🚀

