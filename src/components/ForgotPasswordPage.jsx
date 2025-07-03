import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import config from "../constant/linkApi";
import { useState } from "react";

export const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isLoading,setLoading]=useState(false);
  const onSubmit = async (data) => {
    console.log(data.email)
    setLoading(true)
    try {
      var result=await axios.post(config.API_URL + "/authen/forgot-password", {
        email: data.email,
      });
      console.log(result)
      toast.success("Đã gửi email đặt lại mật khẩu nếu email tồn tại");
    } catch (ex) {
      console.log(ex);
      toast.error("Lỗi hệ thống, vui lòng thử lại");
    }finally{
        setLoading(false)
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Quên mật khẩu</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              {...register("email", { required: "Vui lòng nhập email" })}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg"
            disabled={isLoading}
          >
            {isLoading ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
          </button>
        </form>
      </div>
    </div>
  );
};
