# Vercel Deployment Checklist

## Required Environment Variables

Add these to your Vercel dashboard (Settings → Environment Variables):

### Essential Variables (Required):
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Any random string for JWT tokens
- `TMDB_API_KEY` - Your TMDB API key

### Optional Variables (For full functionality):
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Your Stripe webhook secret
- `SMTP_USER` - Email service username
- `SMTP_PASS` - Email service password
- `SENDER_EMAIL` - Email address for sending emails

## Steps to Deploy:

1. **Add Environment Variables in Vercel:**
   - Go to your Vercel dashboard
   - Select your server project
   - Go to Settings → Environment Variables
   - Add each variable above
   - Make sure to set for "Production" environment

2. **Deploy:**
   ```bash
   git add .
   git commit -m "Fix deployment issues"
   git push
   ```

3. **Test:**
   - Visit: `https://your-app.vercel.app/health`
   - Should show environment variable status

## Common Issues:
- If you get 500 error, check Vercel function logs
- Make sure MongoDB URI is accessible from Vercel
- JWT_SECRET should be a strong random string 