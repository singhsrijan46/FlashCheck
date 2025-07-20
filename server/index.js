const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const cors = require("cors");
app.use(cors());
require("dotenv").config();
const PORT = process.env.PORT || 8080;

const AuthRouter = require("./Routes/AuthRouter");
const connectdb = require("./Models/db.js");
await connectdb();

//API Routes
app.use("/auth", AuthRouter);

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})