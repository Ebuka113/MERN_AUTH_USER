
import express from 'express'
import userAuth from '../middleware/userAuth.js';
import { getUserData } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData) //so the userAuth will provide the email id from the stored cookie token
console.log("✅ userRoute loaded");


export default userRouter