import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(express.json())
app.use(cors())

// Basic health check
app.get('/', (req, res) => {
    res.json({ 
        message: 'Server is Live!',
        timestamp: new Date().toISOString(),
        env: {
            hasMongoUri: !!process.env.MONGODB_URI,
            hasJwtSecret: !!process.env.JWT_SECRET,
            hasTmdbKey: !!process.env.TMDB_API_KEY
        }
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        env: {
            hasMongoUri: !!process.env.MONGODB_URI,
            hasJwtSecret: !!process.env.JWT_SECRET,
            hasTmdbKey: !!process.env.TMDB_API_KEY
        }
    });
});

// Test endpoint
app.get('/test', (req, res) => {
    res.json({ 
        success: true, 
        message: 'API is working!',
        environment: process.env.NODE_ENV || 'development'
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        success: false, 
        message: 'Internal server error'
    });
});

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`)); 