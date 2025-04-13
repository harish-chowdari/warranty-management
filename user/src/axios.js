import axios from "axios";


// const BASE_URL = "https://warranty-management.onrender.com/api"
const BASE_URL = "http://localhost:4000/api" 

const axiosInstance=axios.create({
    baseURL:BASE_URL,
});

export default axiosInstance;   