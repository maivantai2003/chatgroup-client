import axiosInstance from "../interceptors/AxiosInstance";

const cloudmessageFileService = {
  GetAllCloudMessageFile: async (id) => {
    const response = await axiosInstance.get("CloudMessageFile/GetAllCloudMessageFile?userId="+id);
    return response.data;
  },
  GetCloudMessageFileById: async (id) => {
    const response = await axiosInstance.get(`CloudMessageFile/GetById/${id}`);
    return response.data;
  },

  AddCloudMessageFile: async (cloudMessageFileDto) => {
    const response = await axiosInstance.post("CloudMessageFile/Add", cloudMessageFileDto);
    return response.data;
  },
  UpdateCloudMessageFile: async (id, cloudMessageFileDto) => {
    const response = await axiosInstance.put(`CloudMessageFile/Update/${id}`, cloudMessageFileDto);
    return response.data;
  },
  DeleteCloudMessageFile: async (id) => {
    const response = await axiosInstance.delete(`CloudMessageFile/Delete/${id}`);
    return response.data;
  }
};

export default cloudmessageFileService;
