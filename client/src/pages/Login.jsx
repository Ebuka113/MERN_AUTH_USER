import { useContext, useState } from "react"
import { assets } from "../assets/assets"
import {  useNavigate } from "react-router-dom"
import { AppContext } from "../context/AppContext";
import axios from 'axios'
import { toast } from 'react-toastify';


const Login = () => {

    const navigate = useNavigate();

    const {backendUrl, setIsLoggedin, getUserData } = useContext(AppContext)

    const [state, setState] = useState('Sign Up')

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    //to submit the form
    const onSubmitHandler = async (e) => {
      try {
        e.preventDefault();//prevent from reloading
        console.log('Login/Register form submitted'); // ✅ Debug log

        //check about the state if its sign up or login
        if(state === 'Sign Up') {
          axios.defaults.withCredentials = true //this will send the cookies token also with the post request  below

          const {data} = await axios.post(backendUrl + '/api/auth/register', {name, email, password})// post to the backend port 4000, and to that api end point url and the value we are sending
          //now for the data received from the Api assigned in the variable name {data}, so if the response is true or false, we want this below to happen on the ui
          if(data.success) {
            setIsLoggedin(true)//means the user is logged in
            getUserData()//for returning user data back after success to use on the home page
            navigate('/')//if true, navigate to home page
          } else {//if false
            toast.error(data.message);//using toast to display ui error
          }
          
        } else { //login request
            axios.defaults.withCredentials = true; //this will send the cookies token also with the post request  below
          const {data} = await axios.post(backendUrl + '/api/auth/login', { email, password})// post to the backend port 4000, and to that api end point url and the value we are sending
          //now for the data received from the Api assigned in the variable name {data}, so if the response is true or false, we want this below to happen on the ui
          if(data.success) {
            setIsLoggedin(true)//means the user is logged in
            getUserData()//for returning user data back after success to use on the home page
            navigate('/')//if true, navigate to home page
          } else {//if false
             toast.error(data.message);//using toast to display ui error
          }
        }

      } catch (error) {
        toast.error(error.message)
      }
    }

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
          <div
      onClick={() => navigate('/')}
      className="absolute left-5 sm:left-20 top-5 cursor-pointer gradient-text text-[1.8rem] sm:text-[2rem]"
      aria-label="Ebuka Charles Logo"
    >
      ebuka-charles
    </div>

      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">

        <h2 className="text-3xl font-smibold text-white text-center mb-3">
            {state === 'Sign Up' ? 'Create Account' : 'Login'}</h2>

        <p className="text-center text-sm mb-6">{state === 'Sign Up' ? 'Create your account' : 'Login to your account'}</p>


        <form onSubmit={onSubmitHandler}>

            {state === 'Sign Up' && ( 
                <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                <img src={assets.arrowIcon} alt="" />
                <input 
                onChange={e => setName(e.target.value)}
                value={name}
                className="bg-transparent outline-none" 
                type="text" 
                placeholder="Full Name" 
                 required/>
            </div>
        )}

           
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                <img src={assets.message} alt="" />
                <input 
                onChange={e => setEmail(e.target.value)}
                value={email}
                className="bg-transparent outline-none"
                type="email" 
                placeholder="Email id"  
                required/>
            </div>
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                <img src={assets.lock} alt="" />
                <input 
                onChange={e => setPassword(e.target.value)}
                value={password}
                className="bg-transparent outline-none" 
                type="password" 
                placeholder="Password"  
                required/>
            </div>

            <p onClick={() => navigate('/reset-password')} className="mb-4 text-indigo-500 cursor-pointer">Forgot Password?</p>

            <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 
            text-white font-medium cursor-pointer">{state}</button>
        </form>
         
         {state === 'Sign Up' ? (
            <p className="text-gray-400 text-center text-xs mt-4">Already have an account? {' '}
            <span onClick={() => setState('Login')} className="text-blue-400 cursor-pointer underline">Login Here</span>
        </p>
        )
         : (<p className="text-gray-400 text-center text-xs mt-4">Don't have an account? {' '}
            <span onClick={() => setState('Sign Up')} className="text-blue-400 cursor-pointer underline">Sign Up</span>
        </p>
    )}
 
      </div>
    </div>
  )
}

export default Login
