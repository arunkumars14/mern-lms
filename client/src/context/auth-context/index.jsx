import { Skeleton } from "@/components/ui/skeleton";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { checkAuthService, loginInService, registerService } from "@/services";
import { LoaderCircleIcon } from "lucide-react";
import { createContext, useEffect, useState } from "react";
import load from "../../../public/load.gif"

export const AuthContext = createContext(null)

export default function AuthProvider({ children }) {

    const [signInFormData, setSignInFormData] = useState(initialSignInFormData)
    const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData)
    const [auth, setAuth] = useState({
        authenticate: false,
        user: null
    })
    const [loading, setLoading] = useState(true)

    const [activeTab, setActiveTab] = useState("signin")

    async function handleRegisterUser(event) {
        event.preventDefault();
        const data = await registerService(signUpFormData)
        if(data?.success){
            setActiveTab("signin")
            setSignUpFormData(initialSignUpFormData)
        }

    }

    async function handleLoginUser(event) {
        event.preventDefault();
        const data = await loginInService(signInFormData)

        if (data.success) {
            sessionStorage.setItem("accessToken", JSON.stringify(data.data.accessToken))
            setSignInFormData(initialSignInFormData)
            setAuth({
                authenticate: true,
                user: data.data.user
            })
        } else {
            setAuth({
                authenticate: false,
                user: null
            })
        }

    }

    async function checkAuthUser() {
        try {
            const data = await checkAuthService()
            if (data.success) {
                setAuth({
                    authenticate: true,
                    user: data.data.user
                })
                setLoading(false)
            } else {
                setAuth({
                    authenticate: false,
                    user: null
                })
                setLoading(false)
            }
            
        } catch (error) {
            console.log(error)
            if(!error?.response?.data?.success){
                setAuth({
                    authenticate: false,
                    user: null
                })
                setLoading(false)
            }
        }
       
    }

    function resetCredentials(){
        setAuth({
            authenticate: false,
            user: null
        })
    }

    useEffect(() => {
        checkAuthUser()
    }, [])

    if(loading){
        return (
            <div className="flex flex-col h-[100vh] w-full justify-center items-center">
              <img src={load} alt="loading" className="w-[300px]" loading="lazy" />

              <h1 className="font-bold text-[rgb(95,111,255)] text-2xl">Learning Management System</h1>
            </div>
          )
    }


    return <AuthContext.Provider value={{ signInFormData, setSignInFormData, signUpFormData, setSignUpFormData, handleRegisterUser, handleLoginUser, auth, resetCredentials, activeTab, setActiveTab, loading }}>
        {loading ? <Skeleton /> : children} 
    </AuthContext.Provider>
}