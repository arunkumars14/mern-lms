import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

//This is an interceptor. Before each request is sent, it checks whether there's an accessToken stored in the sessionStorage. If it finds one, it adds the token to the request headers as Authorization: Bearer <token>

axiosInstance.interceptors.request.use(config => {
    const accesstoken = JSON.parse(sessionStorage.getItem("accessToken")) || ""
    if(accesstoken) {
        config.headers.Authorization = `Bearer ${accesstoken}`
    }
    return config;
}, (err) => Promise.reject(err))

export default axiosInstance