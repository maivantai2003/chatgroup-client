import axiosInstance from "../interceptors/AxiosInstance";
const groupmessageService = {
    AddGroupMessage:async(groupMessageDto)=>{
    const response=await axiosInstance.post("GroupMessage/AddGroupMessage",groupMessageDto)
    return response.data
  },
  GetAllGroupMessage:async(id,lastMessageDate,pageSize)=>{
    const response=await axiosInstance.get("GroupMessage/GetAllGroupMessage?id="+id+"&lastMessageDate=" +
      (lastMessageDate || "")+"&pageSize="+pageSize)
    return response.data
  }
};

export default groupmessageService;
