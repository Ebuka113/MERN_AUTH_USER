
import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.json({ success: false, message: "Not Authorized, Login Again" });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (tokenDecode.id) {
            req.user = { id: tokenDecode.id }; //SET IT HERE
        } else {
            return res.json({ success: false, message: "Not Authorized, Login Again" });
        }

        next();

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

export default userAuth;

/*//how the sytem get the userId email used for the otp verification and sending. let us set the instruction so system can collect the emailid from token

import jwt from 'jsonwebtoken';

//after completing the code of this function, it will execute the "next parameter" next function and in next it will execute our controller function
const userAuth = async (req, res, next) => {
    const {token} = req.cookies; //the system will find the token from cookie that was initialized before/ stored before

    //if token is not available
    if(!token) {
        return res.json({success: false, message: "Not Authorized, Login Again"})
    }

    //suppose the token is available
    try {
        
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET) //this will verify and decode the token
        //from the decoded token, we have to find the emailid
        if(tokenDecode.id) {
            req.body.userId = tokenDecode.id
        }else {  //added else if the token id is false
            return res.json({success: false, message: "Not Authorized, Login Again"})
        }

        next(); //when successful, this will call our controller function which is sendVerifyOtp function in our authController.js


    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export default userAuth;*/


