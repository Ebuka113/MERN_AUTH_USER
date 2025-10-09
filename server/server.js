// ✅ Import the Express library to create the server and handle routes
import express from "express";

// ✅ Import CORS middleware to allow cross-origin requests (e.g., frontend to backend)
import cors from "cors";

// ✅ Import and load environment variables from a .env file (like PORT, DB_URI, etc.)
import 'dotenv/config';  // same as: import dotenv from 'dotenv'; dotenv.config();

// ✅ Import middleware to parse cookies from incoming requests
import cookieParser from "cookie-parser";

// ✅ Import MongoDB connection and route handlers
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";

// ✅ Create an instance of the Express application
const app = express();

// ✅ Define the port the server will run on, using environment variable or default 4000
const port = process.env.PORT || 4000;

// ✅ Invoke the database connection function
connectDB();

// ✅ Define allowed origins for CORS — local frontend and deployed Vercel frontend
const allowedOrigins = [
  'http://localhost:5000',                   // the frontend Vite local host port
  'https://mern-auth-user.vercel.app'        // ✅ deployed frontend URL on Vercel
];

// ✅ Middleware to handle CORS (Cross-Origin Resource Sharing)
// - Allows requests from specified frontend origins
// - Allows cookies or auth headers to be sent with requests
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser tools like Postman
    if (allowedOrigins.includes(origin)) {
      return callback(null, true); // ✅ Allow this origin
    } else {
      return callback(new Error('❌ Not allowed by CORS'));
    }
  },
  credentials: true // ✅ Allow cookies to be sent across origins
}));

// ✅ Middleware to automatically parse incoming JSON requests (e.g., from fetch or axios)
app.use(express.json());

// ✅ Middleware to parse cookies from client requests
app.use(cookieParser());

// ✅ Default test route to confirm API is working
app.get('/', (req, res) => {
  res.send("✅ API is working now");
});

// ✅ Authentication routes
// path: /api/auth/login, /api/auth/register, /api/auth/logout
app.use('/api/auth', authRouter);

// ✅ User data routes
// path: /api/user/data to fetch user info like username and verification status
app.use('/api/user', userRouter);

// ✅ Start the server on the specified port
app.listen(port, () => {
  console.log(`🚀 Server started on PORT: ${port}`);
});
