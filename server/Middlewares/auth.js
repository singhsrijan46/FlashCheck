import userModel from '../Models/User.js'
import jwt from 'jsonwebtoken';

export const protectAdmin = async (req, res ,next) => {
    try{
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.json({success: false, message: "not authorized"})
        }
        const token = authHeader.split(' ')[1];
        let userId;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded._id;
            console.log('Decoded userId:', userId);
        } catch (err) {
            return res.json({success: false, message: "not authorized"})
        }
        const user = await userModel.findById(userId);
        console.log('User from DB:', user);
        if(!user || user.role !== 'admin') {
            return res.json({success: false, message: "not authorized"})
        }
        next();
    } catch (error) {
        return res.json({success: false, message: "not authorized"})
    }
}