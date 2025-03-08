import axiosInstance from "../interceptors/AxiosInstance";
const groupService = {
  GetAllGroupById:async (userId)=>{
    const respone=await axiosInstance.get("Group/GetAllGroupById?userId="+userId)
    return respone.data
  },
  CreateGroup:async(groupDto)=>{
    const response=await axiosInstance.post("Group/CreateGroup",groupDto)
    return response.data
  }
};

export default groupService;
