import axiosInstance from "../interceptors/AxiosInstance";
const groupmessagefileService = {
  GetAllGroupMessageFile: async (id) => {
    const response = await axiosInstance.get(
      "GroupMessageFile/GetAllGroupMessageFile?groupId=" + id
    );
    return response.data;
  },
  AddGroupMessageFile: async (groupMessageFileDto) => {
    const response = await axiosInstance.post(
      "GroupMessageFile/Add",
      groupMessageFileDto
    );
    return response.data;
  },
};

export default groupmessagefileService;
