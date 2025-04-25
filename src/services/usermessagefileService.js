import axiosInstance from "../interceptors/AxiosInstance";
const usermessagefileService = {
  GetAllUserMessageFile: async (senderId, receiverId) => {
    const response = await axiosInstance.get(
      "UserMessageFile/GetAllUserMessageFile?senderId=" +
        senderId +
        "&receiverId=" +
        receiverId
    );
    return response.data;
  },
  AddUserMessageFile: async (userMessageFileDto) => {
    const response = await axiosInstance.post(
      "UserMessageFile/Add",
      userMessageFileDto
    );
    return response.data;
  },
};

export default usermessagefileService;
