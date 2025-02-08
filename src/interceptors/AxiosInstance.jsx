import axios from "axios";
const axiosInstance=axios.create({
    baseURL:`{""}/`,
    headers: {
        "Content-type": "application/json",
      },
      withCredentials: true,
})
axiosInstance.interceptors.request.use()