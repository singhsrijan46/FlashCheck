const router = require("express").Router();
const { signup, signin } = require("../Controllers/AuthController");
const { signupValidation, signinValidation } = require("../Middlewares/AuthValidation");

router.post("/signin", signinValidation, signin);
router.post("/signup", signupValidation, signup);

module.exports = router;