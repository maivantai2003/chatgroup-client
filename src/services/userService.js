import axiosInstance from "../interceptors/AxiosInstance";
const userService = {
  GetAllUser:async(userId)=>{
    const response=await axiosInstance.get("User/GetAllUser?userId="+userId)
    return response.data
  },
  GetUserById:async(numberPhone)=>{
    const response=await axiosInstance.get("User/GetUserById?numberPhone="+numberPhone)
    return response.data
  }
};

export default userService;
