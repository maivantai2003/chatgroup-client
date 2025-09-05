import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import config from "../constant/linkApi";
import { useState } from "react";
import { Link } from "react-router-dom";

export const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isLoading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await axios.post(config.API_URL + "/authen/forgot-password", {
        email: data.email,
      });
      console.log(result);
      toast.success("Đã gửi email đặt lại mật khẩu nếu email tồn tại");
    } catch (ex) {
      console.error(ex);
      toast.error("Lỗi hệ thống, vui lòng thử lại");
    } finally {
      setLoading(false);
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
          Quên mật khẩu
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              {...register("email", { required: "Vui lòng nhập email" })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập email của bạn"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 rounded-lg shadow-md hover:opacity-90 transition"
            disabled={isLoading}
          >
            {isLoading ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-700 mt-6">
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Quay lại đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};
