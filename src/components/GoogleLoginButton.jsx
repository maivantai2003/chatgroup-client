// // components/GoogleLoginButton.tsx
// import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
// import config from "../constant/linkApi";
// import { toast } from "react-toastify";
// import axios from "axios";

// const CustomGoogleButton = () => {
//   const login = useGoogleLogin({
//     onSuccess: async (tokenResponse) => {
//       try {
//         const result = await axios.post(config.API_URL + "/authen/google-login", {
//           token: tokenResponse.access_token,
//         });
//         toast.success("Đăng nhập Google thành công");
//         console.log("Đăng nhập thành công:", result.data);

//         // 👉 Lưu token nếu backend trả về
//         if (result.data?.accessToken) {
//           localStorage.setItem("accessToken", result.data.accessToken);
//           window.dispatchEvent(new Event("storage"));
//         }
//       } catch (error) {
//         console.error("Lỗi khi login bằng Google:", error);
//         toast.error("Lỗi server khi đăng nhập Google");
//       }
//     },
//     onError: () => toast.error("Đăng nhập Google thất bại"),
//   });

//   return (
//     <button
//       onClick={() => login()}
//       className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg shadow-md hover:bg-gray-100 transition"
//     >
//       <img
//         src="https://www.svgrepo.com/show/355037/google.svg"
//         alt="Google"
//         className="w-5 h-5"
//       />
//       <span className="text-gray-700 font-medium">
//         Đăng nhập bằng Google
//       </span>
//     </button>
//   );
// };

// export const GoogleLoginButton = () => (
//   <GoogleOAuthProvider clientId={config.GOOGLE_CLIENT_ID}>
//     <CustomGoogleButton />
//   </GoogleOAuthProvider>
// );

import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google"
import config from "../constant/linkApi"
import { toast } from "react-toastify"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
export const GoogleLoginButton=()=>{
    const navigate = useNavigate();
    const handleSuccess = async (credentialResponse) => {
    const googleToken = credentialResponse.credential;
    try {
      const result = await axios.post(config.API_URL + "/authen/google-login", {
        token: googleToken,
      });

      console.log("Đăng nhập thành công:", result.data);
       if (result.data?.accessToken) {
        localStorage.setItem("accessToken", result.data.accessToken);
        window.dispatchEvent(new Event("storage"));
        const token = localStorage.getItem("accessToken");
        var user = jwtDecode(token).userInfor;
        localStorage.setItem("user", user);
        toast.success("Đăng nhập Google thành công");
        navigate("/");
      } else {
        toast.error("Không lấy được accessToken từ server");
      }
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