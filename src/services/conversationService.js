import axiosInstance from "../interceptors/AxiosInstance";
const conversationService = {
  GetAllConversation:async(id)=>{
    const response=await axiosInstance.get("Conversation/GetAllConversation/"+id)
    return response.data
  },
  CreateConversation:async(conversationDto)=>{
    const response=await axiosInstance.post("Conversation/CreateConversation",conversationDto)
    return response.data
  },
  GetAllConversationById:async(id)=>{
    const response=await axiosInstance.get("Conversation/GetAllConversation/"+id)
    return response.data
  },
  UpdateConversation:async(id,conversationUpdateDto)=>{
    const response=await axiosInstance.put("Conversation/UpdateConversation/"+id,conversationUpdateDto)
    return response.data
  }
};

export default conversationService;
