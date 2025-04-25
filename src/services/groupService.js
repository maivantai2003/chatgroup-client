import axiosInstance from "../interceptors/AxiosInstance";
const groupService = {
  GetAllGroupById:async (userId)=>{
    const respone=await axiosInstance.get("Group/GetAllGroupById?userId="+userId)
    return respone.data
  },
  CreateGroup:async(groupDto)=>{
    const response=await axiosInstance.post("Group/CreateGroup",groupDto)
    return response.data
  },
  GetGroupById:async (id)=>{
    const respone=await axiosInstance.get("Group/GetGroupById/"+id)
    return respone.data
  },
  UpdateGroup:async (groupUpdateDto)=>{
    const respone=await axiosInstance.put("Group/UpdateGroup",groupUpdateDto)
    return respone.data
  }
};

export default groupService;
