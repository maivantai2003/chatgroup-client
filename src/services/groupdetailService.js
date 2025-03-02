import axiosInstance from "../interceptors/AxiosInstance";
const groupdetailService = {
  CreateGroupDetail:async(groupDetailDto)=>{
    const response=await axiosInstance.post("GroupDetail/CreateGroupDetail",groupDetailDto)
    return response.data
  }
};

export default groupdetailService;
