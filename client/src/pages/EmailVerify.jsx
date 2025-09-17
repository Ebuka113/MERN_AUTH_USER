import axios from "axios"
import { assets } from "../assets/assets"
import { useContext, useEffect, useRef } from "react"
import { AppContext } from "../context/AppContext"
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";



function EmailVerify() {

  axios.defaults.withCredentials = true; //cookies
  const {backendUrl, isLoggedin, userData, getUserData} = useContext(AppContext);

  const navigate = useNavigate();

  //to store the otp recieved in variable
  const inputRefs = useRef([]) //we are selecting multiple fields inputs

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

  //function to handle the form submit
  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map(e => e.value)//all input value is added in this array
      const otp = otpArray.join('')//for a single string

      //api call
      const {data} = await axios.post(backendUrl + '/api/auth/verify-account', {otp}) //the path to send the otp db on backend

      //check
      if(data.success) {
        toast.success(data.message)
        getUserData(); //get the user data like email
        navigate('/')
      } else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  //function to block the verifyemail page so user wont visit again as long as user account is verified
  useEffect(() => {
    isLoggedin && userData && userData.isAccountVerified && navigate('/')//if accountverified is true also, then navigate
  }, [isLoggedin, userData])



  return (
    <div  className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
        <div
          onClick={() => navigate('/')}
          className="absolute left-5 sm:left-20 top-5 cursor-pointer gradient-text text-[1.8rem] sm:text-[2rem] cursor-pointer"
          aria-label="Ebuka Charles Logo"
        >
          ebuka-charles
        </div>

      <form onSubmit={onSubmitHandler} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <h1 className="text-white text-2xl font-semibold text-center mb-4">Email Verify OTP</h1>
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

        <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full
         cursor-pointer">Verify email</button>
      </form>
    </div>
  )
}

export default EmailVerify
