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
import cancellationRouter from './routes/cancellationRoutes.js';
import contactRouter from './routes/contactRoutes.js';

const app = express();
const port = process.env.PORT || 8080;

// Check for required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {

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
        try {
            const server = app.listen(port, () => {
                
            });
            
            // Keep the server running
            server.on('error', (error) => {
        
            });
            
        } catch (portError) {
    
            process.exit(1);
        }
        
    } catch (error) {

        
        if (retryCount < maxRetries) {
            setTimeout(() => {
                initializeServer(retryCount + 1);
            }, retryDelay);
        } else {
            
            
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
app.use('/api/cancellation', cancellationRouter);
app.use('/api/contact', contactRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    
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
initializeServer().catch(error => {

    process.exit(1);
});

export default app;

