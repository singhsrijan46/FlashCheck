# 🚨 FORCE FRESH DEPLOYMENT - Bypass Vercel Cache

## **Current Problem:**
Vercel is using cached code and still trying to import the deleted `stripeWebhooks.js` file.

## **✅ SOLUTION: Force Fresh Deployment**

### **Option 1: Create New Vercel Project (RECOMMENDED)**

1. **Go to [vercel.com](https://vercel.com)**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Set Root Directory to `server`**
5. **Click "Deploy"**
6. **Add Environment Variables:**
   ```
   MONGODB_URI=mongodb+srv://singhsrijangkp:K2BuBG5e2QEg48f3@cluster0.v4rgvgd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=secret1233
   TMDB_API_KEY=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwYTM4M2VmMmNhYzEzOGExM2EyZTM2NTZiYjkwN2Y0OSIsIm5iZiI6MTc1MzU1MjI3My40MzI5OTk4LCJzdWIiOiI2ODg1MTU5MTJiNWNhZmY5ZmE4YTY5MTkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.RVN100TwiSCK8OChjjMUAX14G01wz0JcJXMAy5PW9ZA
   FRONTEND_URL=http://localhost:3000
   ```

### **Option 2: Force Cache Clear (Alternative)**

1. **Go to your current Vercel project**
2. **Settings → General**
3. **Scroll to "Build & Development Settings"**
4. **Click "Clear Build Cache"**
5. **Go to Deployments tab**
6. **Click "Deploy" (not redeploy)**

### **Option 3: Use Vercel CLI (Advanced)**

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from server directory:**
   ```bash
   cd server
   vercel --prod
   ```

## **🔧 What I Fixed:**

1. **✅ Removed stripeWebhooks import** from server.js
2. **✅ Deleted stripeWebhooks.js file** completely
3. **✅ Removed all Stripe dependencies**
4. **✅ Added version comment** to force cache refresh
5. **✅ Simplified booking flow** - no payment processing

## **🎯 Expected Result:**

After fresh deployment, visit: `https://your-new-app.vercel.app/health`

Should return:
```json
{
  "status": "ok",
  "timestamp": "2024-01-XX...",
  "env": {
    "hasMongoUri": true,
    "hasJwtSecret": true,
    "hasTmdbKey": true,
    "frontendUrl": "http://localhost:3000"
  }
}
```

## **📝 Why This Will Work:**

- ✅ **No more stripeWebhooks import** in server.js
- ✅ **File is completely deleted** from the codebase
- ✅ **Fresh deployment** bypasses all cache issues
- ✅ **Simplified environment variables** - no Stripe keys needed

## **🚀 Next Steps After Successful Deployment:**

1. **Test the health endpoint**
2. **Test booking functionality**
3. **Deploy frontend** to use the new backend
4. **Update frontend environment variables**

**The new deployment will work because there are no more problematic imports!** 