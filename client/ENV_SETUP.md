# Environment Variables Setup

Create a `.env` file in the client directory with the following variables:

```
VITE_BASE_URL=http://localhost:8080
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/w500
VITE_CURRENCY=$
```

## Server Environment Variables

Create a `.env` file in the server directory with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
TMDB_API_KEY=your_tmdb_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## Port Configuration

- **Frontend (Vite)**: Runs on port 3000
- **Backend (Express)**: Runs on port 8080 