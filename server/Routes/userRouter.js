import express from 'express';
import { getUserBookings } from '../Controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/bookings', getUserBookings)

export default userRouter;