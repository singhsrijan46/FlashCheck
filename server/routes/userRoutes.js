import express from "express";
import { protect } from "../middleware/auth.js";
import { getUserBookings, getUserFavorites, updateUserFavorites } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get('/bookings', protect, getUserBookings)
userRouter.get('/favorites', protect, getUserFavorites)
userRouter.post('/update-favorite', protect, updateUserFavorites)

export default userRouter;