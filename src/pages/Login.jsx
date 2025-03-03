import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link từ react-router-dom
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/auth/authSlice";
import { toast } from "react-toastify";

const LoginForm = () => {
  const { signIn } = useAuth();
  const user=useSelector((state)=>state.auth.userLogin)
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const onSubmit = async (data) => {
    try {
      let authRequest = {
        phoneNumber: data.password,
        userName: data.userName
      };
      console.log(authRequest)
      const result=await dispatch(login(authRequest)).unwrap()
      console.log(result)
      localStorage.setItem("accessToken",result.accessToken)
      // console.log(authRequest);
      if (result!==null) {
        setErrorMessage(null);
        navigate("/")
        toast.success("Đăng Nhập Thành Công")
      } else {
        setErrorMessage(result?.reason || "Đăng nhập thất bại");
      }
    } catch (error) {
      setErrorMessage(error + "Lỗi hệ thống. Vui lòng thử lại!");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Đăng nhập</h2>
      {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-gray-700">Số điện thoại</label>
          <input
            type="text"
            {...register("password", { required: "Vui lòng nhập số điện thoại" })}
            className="w-full px-4 py-2 border rounded-lg"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-gray-700">Mật khẩu</label>
          <input
            type="userName"
            {...register("userName", { required: "Vui lòng nhập mật khẩu" })}
            className="w-full px-4 py-2 border rounded-lg"
          />
          {errors.userName && <p className="text-red-500 text-sm">{errors.userName.message}</p>}
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg">
          Đăng nhập
        </button>
      </form>

      {/* Link đến trang đăng ký */}
      <p className="text-center text-sm text-gray-600 mt-4">
        Chưa có tài khoản?{" "}
        <Link to="/register" className="text-blue-500 hover:underline">
          Đăng ký
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
