import axiosInstance from "../interceptors/AxiosInstance";
const groupmessagefileService = {
  GetAllGroupMessageFile:async(id)=>{
    const response=await axiosInstance.get("GroupMessageFile/GetAllGroupMessageFile?groupId="+id)
    return response.data
  }
};

export default groupmessagefileService;
