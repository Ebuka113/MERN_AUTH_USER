import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import userModel from '../models/userModels.js';

import transporter from '../config/nodemailer.js'; //transporter for nodemailer.

import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from '../config/emailTemplate.js'; //email template
 

//controller function for user registeration
export const register = async (req, res) => {
    const {name, email, password} = req.body;

    if(!name || !email || !password) {
        return res.json({success: false, message: 'Missing Details'})
    }

    try {

        const existingUser = await userModel.findOne({email}) //existing user with email id
        //if user email id is true
        if(existingUser) {
            return res.json({success: false, message: 'User already exists'});
        }
       
        const hashedPassword = await bcrypt.hash(password, 10); //this automatically generate hash password to store in the db
        //so if there is no user tied to existing email
        const user = new userModel({name, email, password: hashedPassword});
        //now save user in the db
        await user.save();
        //we have to generate token for authentication
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, { expiresIn: '7d'});//JWT_SECRET is the variable name of the secret key in .env and we set the token to expire in 7 days

        //we have send to this token to as response in the form of cookie to the user
        res.cookie('token', token, {
            httpOnly: true,  //which means only http request can access this token
            secure: process.env.NODE_ENV === 'production', //we set .env to 'development' on .env which means === 'production' is false. so whenever we run this project on live server, then it will run on https but in local, it run http
            sameSite: process.env.NODE_ENV === 'production' ?
            'none' : 'strict',   //it is thesame environment, local for local, when production live server for live server for both front end and backend
            maxAge: 7 * 24 * 60 * 60 * 1000//when token expires for 7 days
        })

        //sending welcome email with reference to nodemailer
        const mailOptions ={
            from: process.env.SENDER_EMAIL, //the email message to be sent is coming from the email used to create the brevo smpt account, check .env file
            to: email, //email message to be sent is to be sent to the user who has created the account email
            subject: 'Welcome to Ebuka Shop',  //the message subject to be sent
            text: `Welcome to Ebuka shop website. Your account has been created with this email id: ${email}`
        }
        //now lets send the email using transporter to send mailOptions
        await transporter.sendMail(mailOptions)

         return res.json({success: true})// user is successfully registered

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

//controller function for user login
export const login = async (req, res) => {
    const { email, password} = req.body;

    //validate the email and password using if statement
    if(!email || !password) {
        return res.json({success: false, message: 'Email and Password are required'})
    }

    //now to catch the error supposing we have the existing/regiater email in the db, we must use try and catch incase of error
    try {
        const user = await userModel.findOne({email})//this finds an existing email user when there is a match in the db
        //if the user is not available, which means it could not find any user with the email
        if(!user) {
            return res.json({success: false, message: 'Invalid email'})
        }
        //now if user exists, check password
        const isMatch = await bcrypt.compare(password, user.password) //to compare both passwords (password user provided and password that is in database)
        //if the password doesnt match when compared, drop error message
        if(!isMatch) {
            return res.json({success: false, message: 'Invalid password'})
        }

        //when user exists and password matches, so generate/create token to authenticate user to login in the website
        //we have to generate token for authentication
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, { expiresIn: '7d'});//JWT_SECRET is the variable name of the secret key in .env and we set the token to expire in 7 days

          //we have send to this token to as response in the form of cookie to the user
        res.cookie('token', token, {
            httpOnly: true,  //which means only http request can access this token
            secure: process.env.NODE_ENV === 'production', //we set .env to 'development' on .env which means === 'production' is false. so whenever we run this project on live server, then it will run on https but in local, it run http
            sameSite: process.env.NODE_ENV === 'production' ?
            'none' : 'strict',   //it is thesame environment, local for local, when production live server for live server for both front end and backend
            maxAge: 7 * 24 * 60 * 60 * 1000//when token expires for 7 days
        });

        return res.json({success: true});// user is successfully logged in

    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

//controller function for user logged out
export const logout = async (req, res) => {
    try {
        //we have to clear cookie from the response inorder to logout
        res.clearCookie('token', {
            httpOnly: true,  //which means only http request can access this token
            secure: process.env.NODE_ENV === 'production', //we set .env to 'development' on .env which means === 'production' is false. so whenever we run this project on live server, then it will run on https but in local, it run http
            sameSite: process.env.NODE_ENV === 'production' ?
            'none' : 'strict', 
        })
        return res.json({success: true, message: "logged out"})

    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

//controller function to send verification OTP to the user's Email
export const sendVerifyOtp = async (req, res) => {
  try {
    // ✅ Get userId from the verified JWT (set by middleware), not from req.body
    const userId = req.user?.id;

    if (!userId) {
      return res.json({ success: false, message: "Unauthorized access" });
    }

    // ✅ Find the user by ID
    const user = await userModel.findById(userId);

    // ✅ Check if user exists
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // ✅ If user is already verified, don't send OTP again
    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account already verified" });
    }

    // ✅ Generate a 6-digit OTP and convert to string
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    // ✅ Store OTP and expiry time (1 day from now) in user document
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 1 day expiry

    // ✅ Save the updated user object to DB
    await user.save();

    // ✅ Set up email sending options
    const mailOptions = {
      from: process.env.SENDER_EMAIL, // Email configured in .env and SMTP
      to: user.email, // Send OTP to user's registered email
      subject: 'Account Verification OTP',
      //text: `Your OTP is ${otp}. Verify your account using this OTP.`,
      html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email) //use the email template format here
    };

    // ✅ Send email using the configured transporter
    await transporter.sendMail(mailOptions);

    // ✅ Respond success message
    res.json({ success: true, message: 'Verification OTP sent on Email' });

  } catch (error) {
    // ❌ Handle any unexpected errors
    return res.json({ success: false, message: error.message });
  }
};


//controller function for user to verify their account using the otp sent to their email
export const verifyEmail = async (req, res) => {
  try {
    // ✅ Get userId from authenticated request (middleware)
    const userId = req.user?.id;
    const { otp } = req.body;

    // ✅ Validate inputs
    if (!userId || !otp) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // ✅ Find the user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // ✅ Validate OTP match
    if (!user.verifyOtp || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    // ✅ Check if OTP is expired
    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    // ✅ Mark as verified
    user.isAccountVerified = true;
    user.verifyOtp = '';
    user.verifyOtpExpireAt = 0;
    await user.save();

    return res.json({ success: true, message: "Email verified successfully" });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


//controller function user is already authenticated or not--- nb it is authenting using the middleware userAuth.js cos it also collects the emailid from the cookie token
export const isAuthenticated = async (req, res) => {
    try {
        return res.json({success: true}) 
    } catch (error) {
       return res.json({success: false, message: error.message})  
    }
}

//controller function to reset the user password using reset otp
export const sendResetOtp = async (req, res) => {
    const {email} = req.body;
    //check if user email available 
    if(!email) {
        return res.json({success: false, message: "email is required"})
    }
    // if user email is now available
    try {
        
        const user = await userModel.findOne({email});
        //if user is not available 
        if(!user) {
            return res.json({success: false, message: "user not found"})
        }
        //suppose user is available, we will generate otp and that otp will be save in the database and sent on email
         const otp = String( Math.floor(100000 + Math.random() * 900000));

       user.resetOtp = otp;
       user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000 // ✅ 15 minutes expiry // verify otp to expire for 15 minutes

       await user.save(); //this is used to save the user applied/created in the database

       //now to send the otp, where we want to send otp code which is on the user email
       const mailOptions = {
            from: process.env.SENDER_EMAIL, //the email message to be sent is coming from the email used to create the brevo smpt account, check .env file
            to: user.email, //email message to be sent is to be sent to the user who has created the account email
            subject: 'Password Reset OTP',  //the message subject to be sent
            //text: `Your OTP for resetting your password is ${otp}. Use this OTP to proceed with resetting your password.`
            html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)//email template
       };
       //now transport the email
       await transporter.sendMail(mailOptions);
       //the response feedback when successful
       return res.json({success: true, message: 'OTP sent to your email'})

    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

//controller function where user can verify the otp and reset the password
export const resetPassword = async (req, res) => {
    const {email, otp, newPassword} = req.body;
    //check if email, otp, and newPassword is not available/provided
    if(!email || !otp || !newPassword) {
         return res.json({success: false, message: 'Email, OTP , and new password are required'})
    }

    try {
        //find the user using the email that is in req.body
        const user = await userModel.findOne({email});
        //check if user is not found
        if(!user) {
             return res.json({success: false, message: 'User not found'})
        }
        //if user is available
        //check otp provided does not match or even if input is empty
        if(user.resetOtp === "" || user.resetOtp !==otp) {
             return res.json({success: false, message: 'invalid OTP'})
        }
        //check if otp matches but has expire
        if(user.resetOtpExpireAt < Date.now()) {
             return res.json({success: false, message: 'OTP Expired'})
        }
        //otp is not expired and otp matches, otp is valid
        //so update the user password, we have encrypt that password inorder to store it in database 
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        //update the new password in the database
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;

        await user.save()// the new password is now saved in the database

         return res.json({success: true, message: 'Password has been reset successfully'})

    } catch (error) {
        return res.json({success: false, message: error.message}) 
    }
}



