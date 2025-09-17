import { useContext } from "react"
import { assets } from "../assets/assets"
import { AppContext } from "../context/AppContext"

const Header = () => {
  //this is the ui we want to use the getuserdata() from backend to appcontext to login.jsx now to header.jsx, the userdata will be display in the header ui after login
  const {userData} = useContext(AppContext)
  return (
    <div className="flex flex-col items-center mt-20 px-4 text-center text-gray-800">
      <img src={assets.image1} alt=""  className="w-36 h-36 rounded-full mb-6"/>

      <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-medium
      mb-2">Hello {userData ? userData.name : 'Student'}! <img src={assets.wave} alt="" className="w-8 aspect-square" /></h1>

      <h2 className="text-3xl sm:5xl font-semibold mb-4">Welcome to our shop</h2>

      <p className="mb-8 max-w-md">Let's start with a quick product tour and we will have you up and running in no time!</p>

      <button className="border border-gray-500 rounded-full px-8 py-2.5 
      hover:bg-gray-100 transition-all cursor-pointer">Get Started</button>
    </div>
  )
}

export default Header
