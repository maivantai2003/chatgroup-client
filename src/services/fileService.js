import axiosInstance from "../interceptors/AxiosInstance";
const fileService = {
  CreateFile:async(fileDto)=>{
    const response=await axiosInstance.post("File/CreateFile",fileDto)
    return response.data
  },
  DeleteFile:async(id)=>{
    const response=await axiosInstance.delete("File/DeleteFile/"+id)
    return response.data
  }
};

export default fileService;
