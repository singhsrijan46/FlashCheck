import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    try {
        console.log('🔍 Auth middleware - Headers:', req.headers.authorization ? 'Present' : 'Missing');
        
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            console.log('❌ No token provided');
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        console.log('🔍 Token received:', token.substring(0, 20) + '...');
        
        const decoded = verifyToken(token);
        if (!decoded) {
            console.log('❌ Invalid token');
            return res.status(401).json({ success: false, message: "Invalid token" });
        }

        console.log('🔍 Decoded token userId:', decoded.userId);
        
        const user = await User.findById(decoded.userId);
        if (!user) {
            console.log('❌ User not found for ID:', decoded.userId);
            return res.status(401).json({ success: false, message: "User not found" });
        }

        console.log('✅ User authenticated:', user.email);
        req.user = user;
        next();
    } catch (error) {
        console.error('❌ Auth middleware error:', error);
        return res.status(401).json({ success: false, message: "Not authorized" });
    }
};

export const protectAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Not authorized as admin" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Not authorized" });
    }
};