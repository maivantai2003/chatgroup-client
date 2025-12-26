import { jwtDecode } from "jwt-decode";

import { toast } from "react-toastify";

export const handleLoginSuccess = async (accessToken) =>{
    try{
        localStorage.setItem("accessToken", accessToken);
        window.dispatchEvent(new Event("storage"));
        const token = localStorage.getItem("accessToken");
        var user = jwtDecode(token).userInfor;
        localStorage.setItem("user", user);
        
        // navigate("/");
    }catch(error){
        console.error("Login success handler error:", error);
        toast.error("Có lỗi khi xử lý đăng nhập");
    }
}