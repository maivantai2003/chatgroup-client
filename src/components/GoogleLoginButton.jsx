import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google"
import config from "../constant/linkApi"
import { toast } from "react-toastify"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { handleLoginSuccess } from "../helpers/handleLoginSuccess";
import { useContext, useState } from "react";
import { SignalRContext } from "../context/SignalRContext";
import { handleUpdatestatus } from "../helpers/handleUpdateStatus";
import { handleCreateInforDevice } from "../helpers/handleCreateInforDevice";
import LoadingOverlay from "./LoadingOverlay";
import { processAfterLogin } from "../helpers/processAfterLogin";
export const GoogleLoginButton=()=>{
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const connection=useContext(SignalRContext);
    const handleSuccess = async (credentialResponse) => {
    const googleToken = credentialResponse.credential;
    try {
      setIsLoading(true);
      const result = await axios.post(config.API_URL + "/authen/google-login", {
        token: googleToken,
      });

      console.log("Đăng nhập thành công:", result.data);
       if (result.data?.accessToken) {
        await handleLoginSuccess(result.data?.accessToken);
        // var userInfor = JSON.parse(localStorage.getItem("user"));
        // var userId = userInfor.UserId;
        // await handleUpdatestatus(userId)
        // await handleCreateInforDevice(userId)
        // if (connection) {
        //   connection.on("CheckConnection", (value) => {
        //     console.log(value);
        //   });
        //   connection.invoke("LoadRequestFriend", userId.toString());
        // }
        await processAfterLogin(result.data?.accessToken,connection)
        // localStorage.setItem("accessToken", result.data.accessToken);
        // window.dispatchEvent(new Event("storage"));
        // const token = localStorage.getItem("accessToken");
        // var user = jwtDecode(token).userInfor;
        // localStorage.setItem("user", user);
        // const fcmToken = await requestPermissionAndGetToken()
        // const deviceInfo = navigator.userAgent;
        // const deviceType = "web";
        // console.log("FCM Token:", fcmToken);
        toast.success("Đăng nhập Google thành công");
        navigate("/");
      } else {
        toast.error("Không lấy được accessToken từ server");
      }
    } catch (error) {
      console.error("Lỗi khi login bằng Google:", error);
    }finally {
      setIsLoading(false);
    }
  };

    return( <>
    {isLoading && <LoadingOverlay text="Đang đăng nhập Google..." />}
    <GoogleOAuthProvider clientId={config.GOOGLE_CLIENT_ID}>
        <GoogleLogin onSuccess={handleSuccess} onError={()=>{
            toast.error("Đăng nhập không thành công")
        }}/>
    </GoogleOAuthProvider>
    </>)
}