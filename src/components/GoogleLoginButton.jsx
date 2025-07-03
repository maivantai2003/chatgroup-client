import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google"
import config from "../constant/linkApi"
import { toast } from "react-toastify"
import axios from "axios";

export const GoogleLoginButton=()=>{
    const handleSuccess = async (credentialResponse) => {
    const googleToken = credentialResponse.credential;
    try {
      const result = await axios.post(config.API_URL + "/authen/google-login", {
        token: googleToken,
      });

      console.log("Đăng nhập thành công:", result.data);
    } catch (error) {
      console.error("Lỗi khi login bằng Google:", error);
    }
  };

    return <GoogleOAuthProvider clientId={config.GOOGLE_CLIENT_ID}>
        <GoogleLogin onSuccess={handleSuccess} onError={()=>{
            toast.error("Đăng nhập không thành công")
        }}/>
    </GoogleOAuthProvider>
}