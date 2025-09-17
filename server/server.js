
// ✅ Import the Express library to create the server and handle routes
import express from "express";

// ✅ Import CORS middleware to allow cross-origin requests (e.g., frontend to backend)
import cors from "cors";

// ✅ Import and load environment variables from a .env file (like PORT, DB_URI, etc.)
import 'dotenv/config';  // same as: import dotenv from 'dotenv'; dotenv.config();

// ✅ Import middleware to parse cookies from incoming requests
import cookieParser from "cookie-parser";

//for database
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";



// ✅ Create an instance of the Express application
const app = express();

// ✅ Define the port the server will run on, using environment variable or default 4000
const port = process.env.PORT || 4000;

//to invoke database 
connectDB();

//for front end link
const allowedOrigin = ['http://localhost:5173']//the front end vite local host port


// ✅ Middleware to automatically parse incoming JSON requests (e.g., from fetch or axios)
app.use(express.json());
// ✅ Middleware to parse cookies from client requests
app.use(cookieParser());
// ✅ Enable CORS (Cross-Origin Resource Sharing)
// - credentials: true allows sending cookies or auth headers from frontend
// - you can also specify origin: 'http://localhost:3000' to restrict access
app.use(cors({origin: allowedOrigin, credentials: true })); //this the frontend end vite local host port and cookie token applied to all the app

//Api End points
app.get('/', (req, res) => {
    res.send("API working now")
});

app.use('/api/auth', authRouter) //path for the url /api/auth/login or register or logout (post methods)
app.use('/api/user', userRouter) //path for the url /api/user/data for the fetching(get method) user info like username and account verification status to user ui 

app.listen(port, () => {
    console.log(`server started on PORT:${port}`)
});
