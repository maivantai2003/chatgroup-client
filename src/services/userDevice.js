import axiosInstance from "../interceptors/AxiosInstance"

export const userDevice={
    createUserDevice:async(userDeviceDto)=>{
        const response=await axiosInstance.post("UserDevice",userDeviceDto)
        return response.data
    },
    getUserDevice:async(userId, deviceId)=>{
        const response=await axiosInstance.get(`UserDevice?userId=${userId}&deviceId=${deviceId}`)
        console.log(response)
        return response.data;
    },
    updateUserDevice:async(userDeviceDto)=>{
        const response=await axiosInstance.put("UserDevice",userDeviceDto)
        return response.data
    }
}