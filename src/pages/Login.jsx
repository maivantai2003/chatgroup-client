import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/auth/authSlice";
import { toast } from "react-toastify";
import { SignalRContext } from "../context/SignalRContext";
import { jwtDecode } from "jwt-decode";
import { GoogleLoginButton } from "../components/GoogleLoginButton";

const LoginForm = () => {
  const { signIn } = useAuth();
  const user = useSelector((state) => state.auth.userLogin);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLogin, setLogin] = useState(false);
  const connection = useContext(SignalRContext);

  const onSubmit = async (data) => {
    try {
      setLogin(true);
      let authRequest = {
        phoneNumber: data.userName,
        userName: data.password,
      };
      const result = await dispatch(login(authRequest)).unwrap();
      console.log(result)
      localStorage.setItem("accessToken", result.accessToken);
      window.dispatchEvent(new Event("storage"));
      const token = localStorage.getItem("accessToken");
      var user = jwtDecode(token).userInfor;
      localStorage.setItem("user", JSON.stringify(user));
      var userId = user.UserId;
      console.log(userId)
      if (connection) {
        connection.invoke("LoadRequestFriend", userId.toString());
      }
      if (result !== null) {
        setErrorMessage(null);
        navigate("/");
        toast.success("Đăng Nhập Thành Công");
      } else {
        setErrorMessage(result?.reason || "Đăng nhập thất bại");
        toast.error("Vui Lòng Kiểm Tra Số Điện Thoại Hoặc Mật Khẩu");
      }
    } catch (error) {
      console.log(error)
      setLogin(false);
      setErrorMessage(error + "Lỗi hệ thống. Vui lòng thử lại!");
      toast.error("Lỗi hệ thống. Vui lòng thử lại!");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://cdn.prod.website-files.com/659415b46df8ea43c3877776/65aa597826783da5fc7ab091_chatbot-live-chat-illustration.jpeg')",
      }}
    >
      <div className="max-w-md w-full p-8 rounded-2xl shadow-2xl bg-white/80 backdrop-blur-md border border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Đăng nhập
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1">Số điện thoại</label>
            <input
              type="text"
              {...register("userName", {
                required: "Vui lòng nhập số điện thoại",
              })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập số điện thoại"
            />
            {errors.userName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.userName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Mật khẩu</label>
            <input
              type="password"
              {...register("password", { required: "Vui lòng nhập mật khẩu" })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập mật khẩu"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <p className="text-right text-sm">
            <Link
              to="/forgot-password"
              className="text-blue-600 hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </p>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 rounded-lg shadow-md hover:opacity-90 transition"
            hidden={isLogin}
          >
            Đăng nhập
          </button>

          {/* Nút Google login */}
          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="mx-3 text-gray-500 text-sm">Hoặc</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          <GoogleLoginButton />
        </form>

        <p className="text-center text-sm text-gray-700 mt-6">
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
