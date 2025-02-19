import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const { signIn, isAuthenticated } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorMessage, setErrorMessage] = useState(null);
  //const navigate=useNavigate()
  // useEffect(()=>{
    
  // },[isAuthenticated,navigate])
  const onSubmit = async (data) => {
    try {
      let authRequest={
        userName:data.userName,
        password:data.password
      }
      console.log(authRequest)
      const result = await signIn(authRequest);
      console.log(result)
      if (!result || !result.accessToken) {
        setErrorMessage(result?.reason || "Đăng nhập thất bại");
      } else {
        setErrorMessage(null);
      }
    } catch (error) {
      setErrorMessage(error+"Lỗi hệ thống. Vui lòng thử lại!");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Đăng nhập</h2>
      {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Số điện thoại */}
        <div>
          <label className="block text-gray-700">Số điện thoại</label>
          <input
            type="text"
            {...register("userName", { required: "Vui lòng nhập số điện thoại" })}
            className="w-full px-4 py-2 border rounded-lg"
          />
          {errors.userName && <p className="text-red-500 text-sm">{errors.userName.message}</p>}
        </div>

        {/* Mật khẩu */}
        <div>
          <label className="block text-gray-700">Mật khẩu</label>
          <input
            type="password"
            {...register("password", { required: "Vui lòng nhập mật khẩu" })}
            className="w-full px-4 py-2 border rounded-lg"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg">
          Đăng nhập
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
