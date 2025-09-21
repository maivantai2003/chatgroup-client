import axiosInstance from "../interceptors/AxiosInstance"

export const newPaper={
    GetNewPaper:async()=>{
        const response=await axiosInstance.get("NewPaper/")
        return response.data
    }
}