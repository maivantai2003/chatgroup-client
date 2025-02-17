import axios from "axios";
const axiosInstance=axios.create({
    baseURL:`${process.env.API_URL}/`,
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