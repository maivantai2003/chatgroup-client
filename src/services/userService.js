import axiosInstance from "../interceptors/AxiosInstance";
const userService = {
  GetAllUser:async(userId)=>{
    const response=await axiosInstance.get("User/GetAllUser?userId="+userId)
    return response.data
  },
  GetUserById:async(numberPhone)=>{
    const response=await axiosInstance.get("User/GetUserById?numberPhone="+numberPhone)
    return response.data
  },
  GetUser:async(userId)=>{
    const response=await axiosInstance.get("User/GetUser?userId="+userId)
    return response.data
  },
  UpdateUser:async(id,userUpdateDto)=>{
    const response=await axiosInstance.put("User/UpdateUser/"+id,userUpdateDto)
    return response.data
  },
  CheckPhoneNumber:async(phoneNumber)=>{
    const response=await axiosInstance.get("User/CheckPhoneNumber?phoneNumber="+phoneNumber)
    return response.data
  }
};

export default userService;
