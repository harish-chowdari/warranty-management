import axios from "axios";


const BASE_URL = "https://warranty-management.onrender.com/api" 

const axiosInstance=axios.create({
    baseURL:BASE_URL,
});

export default axiosInstance;   