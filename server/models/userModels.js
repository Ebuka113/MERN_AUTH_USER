
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({ // Define the schema for the User collection
    name: {type: String, required: true}, // User's full name - required field
    email: {type: String, required: true, unique: true}, // User's email address - required and must be unique
    password: {type: String, required: true},  // User's hashed password - required for authentication
    verifyOtp: {type: String, default: ""}, // One-time password (OTP) for account verification - default is empty string
    verifyOtpExpireAt: {type: Number, default: 0}, // Expiry timestamp for the verification OTP (in milliseconds) - default is 0 (no expiry)   
    isAccountVerified: {type: Boolean, default: false}, // Flag to indicate if the user's account has been verified; defaults to false
    resetOtp: {type: String, default: ""},   // One-time password (OTP) for password reset - default is empty string
    resetOtpExpireAt: {type: Number, default: 0},  // Expiry timestamp for the reset OTP (in milliseconds) - default is 0 (no expiry)
})

// Create the User model based on the schema
// If a 'user' model already exists, reuse it (important for hot reloads)
// Otherwise, create a new model named 'user' (which will map to the 'users' collection in MongoDB)
const userModel = mongoose.models.user || mongoose.model('user', userSchema)


export default userModel;