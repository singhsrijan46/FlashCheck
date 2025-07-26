import bcrypt from 'bcrypt';
import userModel from "../Models/User.js";
import jwt from 'jsonwebtoken';

export const signup = async(req, res) => {
    try{
        const { name, email, password } = req.body;
        const found = await userModel.findOne({ email });
        if(found){
            return res.status(409)
                .json({ message: 'User is already exist, you can login', success: false });
        }
        const user = new userModel({ name, email, password });
        user.password = await bcrypt.hash(password, 10);
        await user.save();
        res.status(201)
            .json({
                message: "Signup successfully",
                success: true
            })
    } catch(err){
        res.status(500)
            .json({
                message: "Internal server error",
                success: false
            })
    }
}

export const signin = async(req, res) => {
    try{
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if(!user){
            return res.status(403)
                .json({ message: 'Auth failed email or password is wrong', success: false });
        }
        const isPassEqual = await bcrypt.compare(password, user.password);
        if(!isPassEqual){
            return res.status(403)
                .json({ message: 'Auth failed email or password is wrong', success: false });
        }
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' } 
        )
        res.status(200)
            .json({
                message: "Signin success",
                success: true,
                jwtToken,
                user
            })
    } catch(err){
        res.status(500)
            .json({
                
                message: "Internal server error",
                success: false
            })
    }
}




