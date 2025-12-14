import axiosInstance from "../interceptors/AxiosInstance"

export const userDevice={
    createUserDevice:async(userDeviceDto)=>{
        const response=await axiosInstance.post("UserDevice",userDeviceDto)
        return response.data
    }
}