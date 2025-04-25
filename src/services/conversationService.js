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
  UpdateConversation:async(conversationUpdateDto)=>{
    const response=await axiosInstance.put("Conversation/UpdateConversation",conversationUpdateDto)
    return response.data
  },
  UpdateConversationInfor:async(conversation)=>{
    const respone=await axiosInstance.put("Conversation/UpdateConversationInfor",conversation)
    return respone.data
  },
  UpdateConversationGroup:async(conversationUpdateGroupDto)=>{
    const respone=await axiosInstance.put("Conversation/UpdateConversationGroup",conversationUpdateGroupDto)
    return respone.data
  }
};

export default conversationService;
