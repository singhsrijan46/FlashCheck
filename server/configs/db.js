import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI environment variable is not set');
        }

        const options = {
            serverSelectionTimeoutMS: 30000, // Increased to 30 seconds
            socketTimeoutMS: 45000, // 45 second timeout
            connectTimeoutMS: 30000, // 30 second connection timeout
            maxPoolSize: 10, // Maximum number of connections in the pool
            minPoolSize: 1, // Minimum number of connections in the pool
            maxIdleTimeMS: 30000, // Maximum time a connection can be idle
            retryWrites: true, // Enable retryable writes
            retryReads: true, // Enable retryable reads
            w: 'majority', // Write concern
            readPreference: 'primary', // Read preference
        };

        mongoose.connection.on('connected', () => {
    
        });
        
        mongoose.connection.on('error', (err) => {
    
        });
        
        mongoose.connection.on('disconnected', () => {
    
        });

        // Add connection timeout handling
        const connectionTimeout = setTimeout(() => {
    
            process.exit(1);
        }, 30000);

        await mongoose.connect(process.env.MONGODB_URI, options);
        
        // Clear timeout on successful connection
        clearTimeout(connectionTimeout);
        
    } catch (error) {
        throw error;
    }
}

export default connectDB;