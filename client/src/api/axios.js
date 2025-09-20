import axios from 'axios'
const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
export const Axios = axios.create({
    baseURL: backendURL
})










