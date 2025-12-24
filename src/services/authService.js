import axiosInstance from "../interceptors/AxiosInstance";
const authService = {
  login: async (authRequest) => {
    const response = await axiosInstance.post("Authen/Login",authRequest);
    return response.data;
  },

  refreshToken: async () => {
    const response = await axiosInstance.post(`Authen/RefreshToken`);
    return response.data;
  },
  register:async(userRegister)=>{
    const response=await axiosInstance.post("Authen/Register",userRegister)
    return response.data
  },
  verifyDevice:async(data) => {
    const response=await axiosInstance.post("Authen/verify-device", data)
    return response.data
  }
};

export default authService;
