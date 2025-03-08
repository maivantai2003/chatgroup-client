import axiosInstance from "../interceptors/AxiosInstance";
const cloudmessageService = {
//   GetAllConversation:async(id)=>{
//     const response=await axiosInstance.get("Conversation/GetAllConversation/"+id)
//     return response.data
//   },
  CreateCloudMessage:async(cloudMessageDto)=>{
    const response=await axiosInstance.post("CloudMessage/AddCloudMessage",cloudMessageDto)
    return response.data
  },
  GetCloudMessagesById:async(id)=>{
    const response=await axiosInstance.get("CloudMessage/GetCloudMessagesById/"+id)
    return response.data
  },
//   UpdateConversation:async(id,conversationDto)=>{
//     const response=await axiosInstance.put("Conversation/UpdateConversation/"+id,conversationDto)
//     return response.data
//   }
};

export default cloudmessageService;
