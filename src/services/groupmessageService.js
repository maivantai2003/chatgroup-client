import axiosInstance from "../interceptors/AxiosInstance";
const groupmessageService = {
    AddGroupMessage:async(groupMessageDto)=>{
    const response=await axiosInstance.post("GroupMessage/AddGroupMessage",groupMessageDto)
    return response.data
  },
  GetAllGroupMessage:async(id)=>{
    const response=await axiosInstance.get("GroupMessage/GetAllGroupMessage?id="+id)
    return response.data
  }
};

export default groupmessageService;
