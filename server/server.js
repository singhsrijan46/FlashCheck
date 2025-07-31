import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import showRouter from './routes/showRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import userRouter from './routes/userRoutes.js';
import authRouter from './routes/authRoutes.js';
import { stripeWebhooks } from './controllers/stripeWebhooks.js';

const app = express();
const port = process.env.PORT || 8080;

// Check for required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars);
    console.error('Please set these environment variables in your Vercel dashboard');
}

// Connect to database with error handling
try {
    await connectDB();
} catch (error) {
    console.error('Database connection failed:', error.message);
    // Don't exit, let the app continue but log the error
}

// Stripe Webhooks Route
app.use('/api/stripe', express.raw({type: 'application/json'}), stripeWebhooks)

// Middleware
app.use(express.json())
app.use(cors())

// API Routes
app.get('/', (req, res)=> res.send('Server is Live!'))

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

app.use('/api/auth', authRouter)
app.use('/api/show', showRouter)
app.use('/api/booking', bookingRouter)
app.use('/api/admin', adminRouter)
app.use('/api/user', userRouter)

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        success: false, 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

app.listen(port, ()=> console.log(`Server listening at http://localhost:${port}`));

