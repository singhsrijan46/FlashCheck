import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
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


        req.user = user;
        next();
    } catch (error) {

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