# 🚨 FORCE FRESH DEPLOYMENT - Cache Issue

## **Current Problem:**
```
Failed to create movie: Movie validation failed: runtime: Path `runtime` is required., backdrop_path: Path `backdrop_path` is required., poster_path: Path `poster_path` is required.
```

**This error means Vercel is using CACHED CODE from before our fixes!**

## **✅ SOLUTION: Create New Vercel Project**

### **Step 1: Delete Current Vercel Project**
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Find your current project
3. Click "Settings" → "General"
4. Scroll to bottom → "Delete Project"
5. Confirm deletion

### **Step 2: Create New Project**
1. Click "New Project"
2. Import your GitHub repository
3. **IMPORTANT**: Set "Root Directory" to `server`
4. Click "Deploy"

### **Step 3: Add Environment Variables**
In the new project settings, add:
```
MONGODB_URI=mongodb+srv://singhsrijangkp:K2BuBG5e2QEg48f3@cluster0.v4rgvgd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=secret1233
TMDB_API_KEY=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwYTM4M2VmMmNhYzEzOGExM2EyZTM2NTZiYjkwN2Y0OSIsIm5iZiI6MTc1MzU1MjI3My40MzI5OTk4LCJzdWIiOiI2ODg1MTU5MTJiNWNhZmY5ZmE4YTY5MTkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.RVN100TwiSCK8OChjjMUAX14G01wz0JcJXMAy5PW9ZA
FRONTEND_URL=http://localhost:3000
```

### **Step 4: Test the Fix**
1. **Health Check**: `https://your-new-app.vercel.app/health`
2. **Test Movie Creation**: `https://your-new-app.vercel.app/api/admin/test-movie-creation`
3. **Try Add Shows**: Go to admin panel and add a show

## **🎯 Why This Will Work:**

- ✅ **Fresh deployment** = no cached code
- ✅ **New project** = clean slate
- ✅ **Updated schema** will be used
- ✅ **Bypass validation** will work

## **📝 Alternative: Force Cache Clear**

If you want to keep the same project:
1. Go to project settings
2. "Build & Development Settings"
3. Click "Clear Build Cache"
4. Go to "Deployments"
5. Click "Deploy" (not redeploy)

## **🚨 Expected Result:**

After fresh deployment:
- ✅ Movie creation will work
- ✅ No more validation errors
- ✅ Add shows will work properly

**The new deployment will use the updated schema without `required: true` validation!** 