import axios from "axios";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import config from "../constant/linkApi";
import { useState } from "react";

export const ResetPasswordPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const onSubmit = async (data) => {
    if (token === null || token === undefined) {
      toast.error("Token không tồn tại");
      return;
    }
    if (data.password !== data.confirmPassword) {
      toast.warn("Mật khẩu không khớp");
      return;
    }
    setIsLoading(true);
    try {
      var result = await axios.post(config.API_URL + "/authen/reset-password", {
        token: token,
        newPassword: data.password,
      });
      console.log(result);
      toast.success("Đặt lại mật khẩu thành công! Hãy đăng nhập lại.");
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error("Token không hợp lệ hoặc đã hết hạn");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Đặt lại mật khẩu
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700">Mật khẩu mới</label>
            <input
              type="password"
              {...register("password", {
                required: "Nhập mật khẩu mới",
                minLength: {
                  value: 6,
                  message: "Mật khẩu phải có ít nhất 6 ký tự",
                },
              })}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Xác nhận mật khẩu</label>
            <input
              type="password"
              {...register("confirmPassword", {
                required: "Nhập lại mật khẩu",
                validate: (value) =>
                  value === watch("password") || "Mật khẩu không khớp",
              })}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
          </button>
        </form>
      </div>
    </div>
  );
};
