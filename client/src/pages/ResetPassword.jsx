import { useNavigate } from "react-router-dom"
import { assets } from "../assets/assets"
import { useContext, useRef, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";


const ResetPassword = () => {

  const {backendUrl} = useContext(AppContext)
  axios.defaults.withCredentials = true

   //to store the otp recieved in variable
    const inputRefs = useRef([]) //we are selecting multiple fields inputs

  const navigate = useNavigate();

  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [otp, setOtp] = useState(0)
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false)
  
    //the function that allows automatic move next to the next input field as we type 
  const handleInput = (e, index) => {
    if(e.target.value.length > 0 && index < inputRefs.current.length + 1) {
      inputRefs.current[index + 1].focus()
    }
  }
  //function to delete the number in input field using backspace and it automatically go to the previous input as we delete
  const handleKeyDown = (e, index) => {
    if(e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  }
  //function to handle paste all number to input using crtl v
  const handlePaste =(e) => {
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {// char means character
      if(inputRefs.current[index]) {
        inputRefs.current[index].value = char
      }
    });
  }

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const {data} = await axios.post(backendUrl + '/api/auth/send-reset-otp', {email})//post otp to email
      data.success ? toast.success(data.message) : toast.error(data.message)
      //success should mark sentemail true
      data.success && setIsEmailSent(true)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const onSubmitOTP = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map(e => e.value)
    setOtp(otpArray.join(''))
    //after submitted otp in input and successful, mark setisotpsubmitted as true
    setIsOtpSubmitted(true)
  }

  const onSubmitNewPassword = async (e) => {
  e.preventDefault();
  try {
    const { data } = await axios.post(`${backendUrl}/api/auth/reset-password`, { email, otp, newPassword });
    if (data.success) {
      toast.success(data.message);
      navigate('/login');
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
}


  return (
     <div  className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
         <div
              onClick={() => navigate('/')}
              className="absolute left-5 sm:left-20 top-5 cursor-pointer gradient-text text-[1.8rem] sm:text-[2rem]"
              aria-label="Ebuka Charles Logo"
            >
              ebuka-charles
            </div>

          {/** enter email id */}

          {!isEmailSent &&  ( //whenever the email is not sent, show this

          <form onSubmit={onSubmitEmail} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm" > 
            <h1 className="text-white text-2xl font-semibold text-center mb-4">Reset password</h1>
              <p className="text-center mb-6 text-indigo-300">Enter your registered email address</p>

              <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                <img src={assets.message} alt="" className="w-3 h-3"/>
                <input type="email" placeholder="Email id" 
                className="bg-transparent outline-none text-white"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required />

              </div>

               <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white
                rounded-full mt-3">Submit</button>

          </form>
       )}

         {/**otp input form */}

         {!isOtpSubmitted && isEmailSent && (//whenever the otp is not submitted but email is sent, show this

         
           <form onSubmit={onSubmitOTP} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <h1 className="text-white text-2xl font-semibold text-center mb-4">Reset password OTP</h1>
        <p className="text-center mb-6 text-indigo-300">Enter the 6-digit code sent to your email id</p>

        <div className="flex justify-between mb-8" onPaste={handlePaste}>{/**to create six input field for the otp insert */}
          {Array(6).fill(0).map((_, index) => (
            <input type="text" maxLength='1' key={index} required 
            className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md" 
            ref={e => inputRefs.current[index] = e }//this allow us to type text from one input to another
            onInput={(e) => handleInput(e, index)}// thisallows automatic move next to the next input field as we type 
            onKeyDown={(e) => handleKeyDown(e, index)}// this allows to delete the number in input field using backspace and it automatically go to the previous input as we delete
            />
           

          ))}
        </div>

        <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full 
        cursor-pointer">Verify email</button>
      </form>
      )}
     
      {/** form enter new password */}

      {isOtpSubmitted && isEmailSent && (


       <form onSubmit={onSubmitNewPassword} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm" > 
            <h1 className="text-white text-2xl font-semibold text-center mb-4">New password</h1>
              <p className="text-center mb-6 text-indigo-300">Enter the new password below</p>

              <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                <img src={assets.lock} alt="" className="w-3 h-3"/>
                <input type="password" placeholder="Password" 
                className="bg-transparent outline-none text-white"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required />

  
              </div>
               <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white
                rounded-full mt-3">Submit</button>
              

          </form>
)}

    

    </div>
  )
}

export default ResetPassword
