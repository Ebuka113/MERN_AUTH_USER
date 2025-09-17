
import userModel from "../models/userModels.js";

export const getUserData = async (req, res) => {
    try {
        const userId = req.user?.id; // ✅ read from req.user

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({
            success: true,
            userData: {
                name: user.name,
                isAccountVerified: user.isAccountVerified
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


//controller function that will return the user details like username and it will also return the user verification account status to the ui profile
/*export const getUserData = async (req, res) => {
    try {
        
        const {userId} = req.body

        const user = await userModel.findById(userId);
        //if the user is not available
        if(!user) {
            return res.json({ success: false, message: "user not found" });
        }
        //suppose user is available
        res.json({
            success: true,
            userData: {
                name: user.name,
                isAccountVerified: user.isAccountVerified
            }
        })


    } catch (error) {
        res.json({ success: false, message: error.message });
    }
} */