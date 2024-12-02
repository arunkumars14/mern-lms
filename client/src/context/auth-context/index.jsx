import { Skeleton } from "@/components/ui/skeleton";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { checkAuthService, loginInService, registerService } from "@/services";
import { createContext, useEffect, useState } from "react";

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



    return <AuthContext.Provider value={{ signInFormData, setSignInFormData, signUpFormData, setSignUpFormData, handleRegisterUser, handleLoginUser, auth, resetCredentials, activeTab, setActiveTab, loading }}>
        {loading ? <Skeleton /> : children} 
    </AuthContext.Provider>
}