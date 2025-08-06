import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import showRouter from './routes/showRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import userRouter from './routes/userRoutes.js';
import authRouter from './routes/authRoutes.js';
import theatreRouter from './routes/theatreRoutes.js';
import paymentRouter from './routes/paymentRoutes.js';

const app = express();
const port = process.env.PORT || 8080;

// Check for required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars);
    console.error('Please set these environment variables in your Vercel dashboard');
}

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// API Routes
app.get('/', (req, res) => res.send('Server is Live!'));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        env: {
            hasMongoUri: !!process.env.MONGODB_URI,
            hasJwtSecret: !!process.env.JWT_SECRET,
            hasTmdbKey: !!process.env.TMDB_API_KEY,
            frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
        }
    });
});

// Connect to database with retry mechanism
const initializeServer = async (retryCount = 0) => {
    const maxRetries = 3;
    const retryDelay = 5000; // 5 seconds
    
    try {
        await connectDB();
        
        // Start the server only after successful database connection
        if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
            try {
                app.listen(port, () => {
                    console.log(`🚀 Server listening at http://localhost:${port}`);
                });
            } catch (portError) {
                console.error(`❌ Port ${port} is already in use. Please stop any other services using this port.`);
                process.exit(1);
            }
        }
        
    } catch (error) {
        console.error(`❌ Database connection failed (attempt ${retryCount + 1}/${maxRetries + 1}):`, error.message);
        
        if (retryCount < maxRetries) {
            setTimeout(() => {
                initializeServer(retryCount + 1);
            }, retryDelay);
        } else {
            console.error('💥 Maximum retry attempts reached. Server startup failed.');
            console.error('💡 Please check:');
            console.error('   1. MongoDB Atlas cluster status');
            console.error('   2. Network connectivity');
            console.error('   3. Environment variables');
            console.error('   4. IP whitelist settings');
            
            // In production, we might want to exit gracefully
            if (process.env.NODE_ENV === 'production') {
                process.exit(1);
            }
        }
    }
};

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/show', showRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);
app.use('/api/theatre', theatreRouter);
app.use('/api/payment', paymentRouter);

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

// Initialize database connection and start server
initializeServer();

export default app;

