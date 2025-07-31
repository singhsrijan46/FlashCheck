import express from "express";
import { protectAdmin } from "../middleware/auth.js";
import { getAllBookings, getAllShows, getDashboardData, isAdmin, getAllShowsDebug, createTestShows } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.get('/is-admin', protectAdmin, isAdmin)
adminRouter.get('/dashboard', protectAdmin, getDashboardData)
adminRouter.get('/all-shows', protectAdmin, getAllShows)
adminRouter.get('/all-shows-debug', protectAdmin, getAllShowsDebug)
adminRouter.post('/create-test-shows', protectAdmin, createTestShows)
adminRouter.get('/all-bookings', protectAdmin, getAllBookings)

export default adminRouter;