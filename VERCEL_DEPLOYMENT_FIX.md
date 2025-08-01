# Vercel Deployment Fix Guide

## Current Error: 500 Internal Server Error - FUNCTION_INVOCATION_FAILED

### **Immediate Fix Steps:**

#### 1. **Add Environment Variables in Vercel Dashboard**

Go to your Vercel project dashboard and add these **REQUIRED** environment variables:

**Essential Variables:**
```
MONGODB_URI=mongodb+srv://singhsrijangkp:K2BuBG5e2QEg48f3@cluster0.v4rgvgd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=secret1233
TMDB_API_KEY=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwYTM4M2VmMmNhYzEzOGExM2EyZTM2NTZiYjkwN2Y0OSIsIm5iZiI6MTc1MzU1MjI3My40MzI5OTk4LCJzdWIiOiI2ODg1MTU5MTJiNWNhZmY5ZmE4YTY5MTkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.RVN100TwiSCK8OChjjMUAX14G01wz0JcJXMAy5PW9ZA
```

**Optional Variables:**
```
FRONTEND_URL=http://localhost:3000
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_pass
SENDER_EMAIL=your_email@domain.com
```

#### 2. **Redeploy Your Application**

After adding environment variables:
1. Go to your Vercel project
2. Click "Redeploy" 
3. Wait for deployment to complete

#### 3. **Test Your Deployment**

Visit these URLs to test:
- **Health Check**: `https://your-app.vercel.app/health`
- **Main Endpoint**: `https://your-app.vercel.app/`

### **What I Fixed:**

1. **Updated `vercel.json`**: Added function timeout configuration
2. **Improved Server Configuration**: 
   - Better error handling
   - Serverless-friendly database connection
   - Proper middleware order
3. **Environment Variable Validation**: Added checks for required variables
4. **Removed all Stripe/payment gateway code**: Simplified the application

### **Common Issues & Solutions:**

#### **Issue 1: Still getting 500 error**
- **Solution**: Check Vercel function logs in dashboard
- **Action**: Go to Functions tab → View logs

#### **Issue 2: Database connection fails**
- **Solution**: Verify `MONGODB_URI` is correct
- **Action**: Test connection string locally first

#### **Issue 3: CORS errors**
- **Solution**: Add `FRONTEND_URL` environment variable
- **Action**: Set it to your frontend URL

### **Debug Steps:**

1. **Check Vercel Logs**:
   - Go to your Vercel project
   - Click "Functions" tab
   - Check the logs for specific errors

2. **Test Health Endpoint**:
   - Visit: `https://your-app.vercel.app/health`
   - Should show environment variable status

3. **Verify Environment Variables**:
   - Go to Settings → Environment Variables
   - Ensure all required variables are set

### **Expected Result:**

After fixing, your health endpoint should return:
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

### **Next Steps:**

1. Add environment variables in Vercel dashboard
2. Redeploy your application
3. Test the health endpoint
4. If still failing, check Vercel function logs 