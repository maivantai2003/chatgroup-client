import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google"
import config from "../constant/linkApi"
import { toast } from "react-toastify"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { handleLoginSuccess } from "../helpers/handleLoginSuccess";
import { useContext, useState } from "react";
import { SignalRContext } from "../context/SignalRContext";
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
      if (result.data?.accessToken) {
        await handleLoginSuccess(result.data?.accessToken);
        await processAfterLogin(result.data?.accessToken,connection)
        navigate("/");
        toast.success("Đăng nhập Google thành công");
      } else {
        toast.error("Gmail không tồn tại");
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