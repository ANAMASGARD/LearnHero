# 🔧 AWS Amplify Deployment Troubleshooting

## If Deployment is Not Starting or Failing

### Issue: "Permission Denied" or "Cannot Connect to GitHub"

**Solution:**
1. Go to AWS Amplify Console
2. Click on your app → **App settings** → **General**
3. Scroll to **Repository** section
4. Click **"Disconnect branch"** if connected
5. Click **"Connect branch"** again
6. Re-authorize GitHub connection
7. Select your repository and branch
8. Click **"Save"**

---

### Issue: Build Fails at "npm ci" or "npm install"

**Solution:**
1. Check if `package-lock.json` exists in your repo
2. If not, commit it:
   ```bash
   git add package-lock.json
   git commit -m "Add package-lock.json"
   git push
   ```

3. Or update `amplify.yml` to use `npm install` instead:
   ```yaml
   preBuild:
     commands:
       - npm install
   ```

---

### Issue: Build Succeeds but App Shows Blank Page

**Solution:**
1. Check browser console for errors
2. Verify all `NEXT_PUBLIC_*` environment variables are set
3. Check Amplify Console → **App settings** → **Environment variables**
4. Make sure variables are added correctly (no extra spaces)

---

### Issue: "Module not found" Errors

**Solution:**
1. Make sure all dependencies are in `package.json`
2. Check build logs for specific missing module
3. Add missing dependency:
   ```bash
   npm install <missing-module>
   git add package.json package-lock.json
   git commit -m "Add missing dependency"
   git push
   ```

---

### Issue: Environment Variables Not Working

**Solution:**
1. **Check variable names**: Must match exactly (case-sensitive)
2. **Check NEXT_PUBLIC_ prefix**: Client-side variables need this
3. **Redeploy after adding variables**: Variables only apply to new builds
4. **Check for typos**: Common mistakes:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (not `PUBLISHABLE_KEY`)
   - `DATABASE_URL` (not `DB_URL`)

---

### Issue: Database Connection Fails

**Solution:**
1. Verify `DATABASE_URL` is correct in Amplify environment variables
2. Check if database allows connections from AWS IPs
3. For Neon: Make sure connection string includes `?sslmode=require`
4. Test connection string locally first

---

### Issue: Clerk Authentication Not Working

**Solution:**
1. **Update Clerk Dashboard**:
   - Go to https://dashboard.clerk.com/
   - Navigate to **Paths** → **Allowed origins**
   - Add your Amplify URL: `https://*.amplifyapp.com`
   - Or specific: `https://main.abc123.amplifyapp.com`

2. **Update Redirect URLs**:
   - In Clerk Dashboard → **Paths**
   - Update:
     - After sign-in: `https://YOUR_APP.amplifyapp.com/workspace`
     - After sign-up: `https://YOUR_APP.amplifyapp.com/workspace`

---

### Issue: Build Takes Too Long or Times Out

**Solution:**
1. Check build logs for specific step that's slow
2. Optimize build:
   - Remove unused dependencies
   - Check for large files in repository
   - Use `.amplifyignore` to exclude unnecessary files

---

## 🚨 Quick Fixes

### Fix 1: Clear Build Cache
1. Go to Amplify Console
2. Click **App settings** → **Build settings**
3. Click **"Clear cache"**
4. Redeploy

### Fix 2: Check Build Logs
1. Go to Amplify Console
2. Click on your app
3. Click **"Deployments"** tab
4. Click on failed deployment
5. Check **"Build logs"** for specific errors

### Fix 3: Verify amplify.yml
Make sure `amplify.yml` is in the **root directory** of your repository.

### Fix 4: Test Build Locally
```bash
npm ci
npm run build
```
If this fails locally, it will fail on Amplify too.

---

## 📋 Pre-Deployment Checklist

Before deploying, verify:

- [ ] Code is pushed to GitHub
- [ ] `amplify.yml` exists in root
- [ ] `package.json` has all dependencies
- [ ] `package-lock.json` is committed
- [ ] `.env` is NOT committed (in .gitignore)
- [ ] All environment variables are ready
- [ ] Database is accessible
- [ ] Clerk keys are ready
- [ ] Build works locally (`npm run build`)

---

## 🔍 Debugging Steps

1. **Check Build Logs**:
   - Amplify Console → Your App → Deployments → Click deployment → Build logs

2. **Check Environment Variables**:
   - Amplify Console → App settings → Environment variables
   - Verify all are present and correct

3. **Test Locally**:
   ```bash
   npm ci
   npm run build
   npm start
   ```

4. **Check GitHub Connection**:
   - Amplify Console → App settings → General → Repository
   - Verify connection is active

---

## 💡 Pro Tips

1. **Use Amplify Console Logs**: Always check build logs first
2. **Test Locally First**: If it builds locally, it should build on Amplify
3. **Add Variables Gradually**: Add a few variables, deploy, then add more
4. **Use Amplify CLI** (optional): For advanced users
   ```bash
   npm install -g @aws-amplify/cli
   amplify init
   amplify add hosting
   amplify publish
   ```

---

## 🆘 Still Not Working?

If deployment still fails:

1. **Share Build Logs**: Copy error from Amplify Console
2. **Check Specific Error**: Look for red text in build logs
3. **Verify amplify.yml**: Make sure it's correct
4. **Test Build Command**: Run `npm run build` locally

The most common issue is **missing environment variables** - double-check all are added!

