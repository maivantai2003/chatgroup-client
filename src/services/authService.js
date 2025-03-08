import axiosInstance from "../interceptors/AxiosInstance";
const authService = {
  login: async (authRequest) => {
    const response = await axiosInstance.post("Authen/AuthToken",authRequest);
    return response.data;
  },

  refreshToken: async () => {
    const response = await axiosInstance.post(`Authen/RefreshToken`);
    return response.data;
  },
  register:async(userRegister)=>{
    const response=await axiosInstance.post("Authen/Register",userRegister)
    return response.data
  }
};

export default authService;
