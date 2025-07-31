import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI environment variable is not set');
        }

        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // 5 second timeout
            socketTimeoutMS: 45000, // 45 second timeout
        };

        mongoose.connection.on('connected', () => console.log('Database connected'));
        mongoose.connection.on('error', (err) => console.error('Database connection error:', err));
        mongoose.connection.on('disconnected', () => console.log('Database disconnected'));

        await mongoose.connect(`${process.env.MONGODB_URI}/quickshow`, options);
    } catch (error) {
        console.error('Database connection failed:', error.message);
        throw error;
    }
}

export default connectDB;