
//For the functionality
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    axios.defaults.withCredentials =  true;


    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedin, setIsLoggedin] = useState(false)//false which means user will be logout as initial state
    const [userData, setUserData] = useState(false)

    //to authenticate user on ui, so this keeps the page of login stay even upon refresh but we need to add credentials above inorder to complete/compliment this function so login remain even upon refresh
    const getAuthState = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/auth/is-auth')//the backend url
            if(data.success) {
                setIsLoggedin(true)
                getUserData()
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //create a function on ui that will get the user data and update on ui, hence we done on the backend
    const getUserData = async () => {
        try {
           // make the api call from front end to back end
           const {data} = await axios.get(backendUrl + '/api/user/data')
           data.success ? setUserData(data.userData) : toast.error(data.message)
            
        } catch (error) {
            toast.error(error.message)
        }
    }

    //let call the getAuthState() whenever the page is loaded using useEffect hook
    useEffect(() => {
        getAuthState();//what it does is that whenever the page load check for user auth status and it will get the user detail
    },[])

    const value = {
        backendUrl,
        isLoggedin, setIsLoggedin,
        userData, setUserData,
        getUserData
    }

    return (
        <AppContext.Provider value={value} >
            {props.children}
        </AppContext.Provider>
    )
}
