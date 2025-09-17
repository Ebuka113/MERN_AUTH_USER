
//for api end points
import express from 'express'
import { isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail } from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);

//api end point for verifyOtp
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp); //userAuth function is the one to call here because it is used to collect the user emailId from otp to be used in sending otp, and then our controller function sendVerifyOtp which is actually going to do the sending
authRouter.post('/verify-account', userAuth, verifyEmail); //this is to now verify the otp user input on the ui
authRouter.get('/is-auth', userAuth, isAuthenticated);//before it was post but when doing frontend we change it to get //nb it is authenting using the middleware userAuth.js cos it also collects the emailid from the cookie token
authRouter.post('/send-reset-otp', sendResetOtp); // to send otp to reset password, user will provide email
authRouter.post('/reset-password',  resetPassword); //to verify the otp inputted in the ui by the user for the reset password- user provide email, otp, and new password


export default authRouter;
