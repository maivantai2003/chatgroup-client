import axios from "axios";
import config from "../constant/linkApi";
const axiosInstance=axios.create({
    baseURL:`${config.API_URL}/`,
    headers: {
        "Content-type": "application/json",
      },
      withCredentials: true,
})
axiosInstance.interceptors.request.use(
  async(config)=>{
    config.hear
  }
)