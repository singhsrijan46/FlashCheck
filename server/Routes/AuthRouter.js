import express from 'express';
import { signup, signin } from "../Controllers/authController.js";
import { signupValidation, signinValidation } from "../Middlewares/authValidation.js";

const authRouter = express.Router();

authRouter.post("/signin", signinValidation, signin);
authRouter.post("/signup", signupValidation, signup);

export default authRouter;