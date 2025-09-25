import axiosInstance from "../interceptors/AxiosInstance";
const usermessageService = {
  CreateUserMessage:async(userMessageDto)=>{
    const response=await axiosInstance.post("UserMessage/CreateUserMessage",userMessageDto)
    return response.data
  },
  GetAllUserMessage:async(senderId,receiverId,lastMessage,pageSize)=>{
    const response=await axiosInstance.get("UserMessage/GetAllUserMessage?senderId="+senderId+"&receiverId="+receiverId+"&lastMessageDate=" +
      (lastMessage || "")+"&pageSize="+pageSize)
    return response.data
  }
};

export default usermessageService;
