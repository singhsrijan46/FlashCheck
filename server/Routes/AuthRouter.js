const router = require("express").Router();
import { signup, signin } from "../Controllers/AuthController";
import  { signupValidation, signinValidation } from "../Middlewares/AuthValidation";

router.post("/signin", signinValidation, signin);
router.post("/signup", signupValidation, signup);

module.exports = router;