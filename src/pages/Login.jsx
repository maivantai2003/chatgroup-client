import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link từ react-router-dom
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/auth/authSlice";
import { toast } from "react-toastify";
import { SignalRContext } from "../context/SignalRContext";
import { jwtDecode } from "jwt-decode";

const LoginForm = () => {
  const { signIn } = useAuth();
  const user=useSelector((state)=>state.auth.userLogin)
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const [isLogin,setLogin]=useState(false);
  const connection=useContext(SignalRContext)
  const onSubmit = async (data) => {
    try {
      setLogin(true);
      let authRequest = {
        phoneNumber:data.userName,
        userName:  data.password
      };
      console.log(authRequest)
      const result=await dispatch(login(authRequest)).unwrap()
      localStorage.setItem("accessToken",result.accessToken)
      window.dispatchEvent(new Event("storage"));
      const token = localStorage.getItem("accessToken");
      var user = jwtDecode(token).userInfor;
      localStorage.setItem("user", user);
      var userInfor = JSON.parse(localStorage.getItem("user"));
      var userId = userInfor.UserId;
      console.log(userId)
      if(connection){
        connection.on("CheckConnection",(value)=>{
          console.log(value)
        })
        connection.invoke("LoadRequestFriend",userId.toString())
      }
      // console.log(authRequest);
      if (result!==null) {
        setErrorMessage(null);
        navigate("/")
        toast.success("Đăng Nhập Thành Công")
      } else {
        setErrorMessage(result?.reason || "Đăng nhập thất bại");
        toast.error("Vui Lòng Kiểm Tra Số Điện Thoại Hoặc Mật Khẩu")
        return
      }
    } catch (error) {
      setLogin(false);
      setErrorMessage(error + "Lỗi hệ thống. Vui lòng thử lại!");
      toast.error("Lỗi hệ thống. Vui lòng thử lại!")
      return
    }
  };

  return (
    <div 
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('https://cdn.prod.website-files.com/659415b46df8ea43c3877776/65aa597826783da5fc7ab091_chatbot-live-chat-illustration.jpeg')" }}
    >
      <div className="max-w-md w-full p-6 rounded-lg shadow-lg bg-white/30 backdrop-blur-md border border-white/50">
        <h2 className="text-2xl font-bold mb-4 text-center">Đăng nhập</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-700">Số điện thoại</label>
            <input
              type="text"
              {...register("userName", { required: "Vui lòng nhập số điện thoại" })}
              className="w-full px-4 py-2  border rounded-lg"
            />
            {errors.userName && <p className="text-red-500 text-sm">{errors.userName.message}</p>}
          </div>

          <div>
            <label className="block text-gray-700">Mật khẩu</label>
            <input
              type="password"
              {...register("password", { required: "Vui lòng nhập mật khẩu" })}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg" hidden={isLogin}>
            Đăng nhập
          </button>
        </form>

        <p className="text-center text-sm text-gray-800 mt-4">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-blue-700 hover:underline">
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
