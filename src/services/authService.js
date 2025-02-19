import axiosInstance from "../interceptors/AxiosInstance";
const authService = {
  login: async (AuthRequest) => {
    console.log(AuthRequest)
    const response = await axiosInstance.post("Account/AuthToken",AuthRequest);
    return response.data;
  },

  refreshToken: async () => {
    const response = await axiosInstance.post(`Account/RefreshToken`);
    return response.data;
  },
};

export default authService;
