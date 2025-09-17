
import { useNavigate } from "react-router-dom"
import { assets } from "../assets/assets"
import { useContext } from "react"
import { AppContext } from "../context/AppContext"
import { toast } from "react-toastify"
import axios from "axios"

const Navbar = () => {

    const navigate = useNavigate() //used to navigate between pages

    //on the nav bar if the userData is available, display 
    const {userData, backendUrl, setUserData, setIsLoggedin} = useContext(AppContext)

    //ui function to verifyAccount
    const sendVerificationOtp = async () => {
      try {
        axios.defaults.withCredentials = true;
        //api call to send verification otp using backend url
        const {data} = await axios.post(backendUrl + '/api/auth/send-verify-otp')
        //check
        if(data.success) {
          navigate('/email-verify')
          toast.success(data.message)
        }else {
          toast.error(data.message)
        }
        
      } catch (error) {
         toast.error(error.message)
      }
    }

    //functionality for logout
    const logout = async () => {
      try {
        axios.defaults.withCredentials = true //collecting the cookie token also as it is posting to the backend url
        const { data } = await axios.post(backendUrl + '/api/auth/logout')//the api end point of logout from backend
        data.success && setIsLoggedin(false)
        data.success && setUserData(null)
        navigate('/')

      } catch (error) {
        toast.error(error.message)
      }
    }

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
            <div
        className="cursor-default select-none gradient-text"
        aria-label="Ebuka Charles Logo"
      >
        ebuka-charles
      </div>



      { userData ? 
      
      <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group cursor-pointer">
        { userData.name[0].toUpperCase() }

        <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">

          <ul className="list-none m-0 p-2 bg-gray-100 text-sm">

            { !userData.isAccountVerified && 
            <li onClick={sendVerificationOtp} className="py-1 px-2 hover:bg-gray-200 cursor-pointer">Verify Email</li>
            }

            <li onClick={logout} className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10">Logout</li>
          </ul>
        </div>
      </div>

      :   <button onClick={() => navigate('/login')}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100
         transition-all ">Login <img src={assets.arrowIcon} alt="" /></button>
      }

      </div>    
  )
}

export default Navbar
