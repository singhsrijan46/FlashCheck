# Deployment Guide

## Environment Variables Setup

### Frontend (Client) Environment Variables

Create a `.env` file in the `client` directory:

```env
# Development
VITE_BASE_URL=http://localhost:8080
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/w500
VITE_CURRENCY=$

# Production (Update with your actual backend URL)
# VITE_BASE_URL=https://your-backend-app.vercel.app
# VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/w500
# VITE_CURRENCY=$
```

### Backend (Server) Environment Variables

Create a `.env` file in the `server` directory:

```env
# Database Configuration
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/your_database

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# TMDB API Configuration
TMDB_API_KEY=your_tmdb_api_key_here

# Email Configuration (Optional)
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SENDER_EMAIL=your_sender_email@domain.com

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Production URLs (Update with your actual frontend URL)
# FRONTEND_URL=https://your-frontend-app.vercel.app
```

## Deployment Steps

### 1. Backend Deployment (Vercel)

1. **Push your server code to GitHub**
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set root directory to `server`
   - Deploy

3. **Add Environment Variables in Vercel**:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add all the server environment variables listed above

### 2. Frontend Deployment (Vercel)

1. **Update Frontend Environment**:
   - Update `VITE_BASE_URL` in client `.env` with your backend URL
   - Example: `VITE_BASE_URL=https://your-backend-app.vercel.app`

2. **Deploy Frontend**:
   - Create a new Vercel project
   - Set root directory to `client`
   - Deploy

### 3. Update CORS Configuration

After deploying both frontend and backend:

1. **Update Backend CORS**:
   - Go to your backend Vercel project
   - Add environment variable: `FRONTEND_URL=https://your-frontend-app.vercel.app`
   - Redeploy

## Environment Variables Explanation

### Frontend Variables:
- `VITE_BASE_URL`: Backend API URL
- `VITE_TMDB_IMAGE_BASE_URL`: TMDB image CDN URL
- `VITE_CURRENCY`: Currency symbol for pricing

### Backend Variables:
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `TMDB_API_KEY`: TMDB API key for movie data
- `SMTP_USER/PASS`: Email service credentials
- `SENDER_EMAIL`: Email address for notifications
- `FRONTEND_URL`: Frontend URL for CORS

## Testing Deployment

1. **Test Backend Health**: Visit `https://your-backend-app.vercel.app/health`
2. **Test Frontend**: Visit your frontend URL
3. **Test API Calls**: Check if frontend can communicate with backend

## Troubleshooting

### Common Issues:
1. **CORS Errors**: Ensure `FRONTEND_URL` is set correctly in backend
2. **API 404**: Check if `VITE_BASE_URL` is correct in frontend
3. **Database Connection**: Verify `MONGODB_URI` is accessible
4. **Environment Variables**: Ensure all required variables are set in Vercel

### Debug Steps:
1. Check Vercel function logs
2. Test health endpoint
3. Verify environment variables in Vercel dashboard
4. Check CORS configuration 