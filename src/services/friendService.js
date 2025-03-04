import axiosInstance from "../interceptors/AxiosInstance";
const friendService = {
  GetAllFriendById: async (userId) => {
    const response = await axiosInstance.get("Friend/GetAllFriendById?userId="+userId);
    return response.data;
  },
  GetFriendRequest:async (friendId)=>{
    const response=await axiosInstance.get("Friend/GetFriendRequest?friendId="+friendId)
    return response.data
  },
  UpdateFriend:async(id,friendDto)=>{
    const response=await axiosInstance.put("Friend/UpdateFriend/"+id,friendDto)
    return response.data
  },
  AddFriend:async(friendDto)=>{
    const response=await axiosInstance.post("Friend/AddFriend",friendDto)
    return response.data
  }
};

export default friendService;
