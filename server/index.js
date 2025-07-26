import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import 'dotenv/config';

import authRouter from './Routes/authRouter.js';
import './Models/db.js'
import showRouter from "./Routes/showRouter.js";
import bookingRouter from "./Routes/bookingRouter.js";
import adminRouter from "./Routes/adminRouter.js";
import userRouter from "./Routes/userRouter.js";

const app = express();
const PORT = process.env.PORT || 8080;



//Middlewares
app.use(bodyParser.json());
app.use(cors());


//API Routes
app.use("/auth", authRouter);
app.use("/api/show", showRouter);
app.use("/api/booking", bookingRouter)
app.use("/api/admin", adminRouter)
app.use("/api/user", userRouter)

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})