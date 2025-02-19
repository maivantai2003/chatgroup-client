import { useDispatch, useSelector } from "react-redux";
import { setCredentials,logout } from "../redux/auth/authSlice";
import authService from "../services/authService";
import { jwtDecode } from "jwt-decode";

export const useAuth = () => {
  const { user, accessToken, refreshToken, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const signIn = async (credentials) => {
    try {
      const data=await authService.login(credentials);
      const user= jwtDecode(data.accessToken);
      //console.log(user)
      await dispatch(setCredentials({
        user: user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      }));
      return { success: true, user };
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const signOut = async () => {
    try {
      await authService.logout();
      dispatch(logout());
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const refreshAccessToken = async () => {
    try {
      if (!refreshToken) return signOut();
      const data = await authService.refreshToken(refreshToken);
      dispatch(setCredentials({
        user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      }));
    } catch (error) {
      console.error("Refresh token failed:", error);
      signOut();
    }
  };

  return { user, accessToken, refreshToken, isAuthenticated, signIn, signOut, refreshAccessToken };
};
