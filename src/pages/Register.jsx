import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUser, FaPhone, FaLock, FaBirthdayCake } from "react-icons/fa";
import { MdWc } from "react-icons/md";
import { registerUser } from "../redux/auth/authSlice";
import axios from "axios";
import config from "../constant/linkApi";
import { toast } from "react-toastify";
import { CreateCloudMessage } from "../redux/cloudmessage/cloudmessageSlice";
import { CreateConversation } from "../redux/conversation/conversationSlice";
import { CheckPhoneNumber } from "../redux/user/userSlice";

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const DEFAULT_AVATAR = config.DEFAULT_AVATAR;
  const [avatarPreview, setAvatarPreview] = useState(DEFAULT_AVATAR);
  const [avatarFile, setAvatarFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return avatarPreview;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", avatarFile);

    try {
      const response = await axios.post(
        `${config.API_URL}/File/Upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setIsUploading(false);
      return response.data.url;
    } catch (error) {
      console.error("Upload ảnh thất bại", error);
      return avatarPreview;
    }
  };

  const onSubmit = async (data) => {
    if (data.phoneNumber) {
      var result = await dispatch(CheckPhoneNumber(data.phoneNumber)).unwrap();
      console.log(result);
      if (result) {
        toast.warning("Số điện thoại đã tồn tại");
        return;
      }
    }
    const avatarUrl = await uploadAvatar();
    let userRegister = {
      userName: data.userName,
      sex: data.sex,
      phoneNumber: data.phoneNumber,
      birthday: data.birthday,
      avatar: avatarUrl,
      password: data.password,
    };
    console.log(userRegister);
    try {
      const result = await dispatch(registerUser(userRegister)).unwrap();
      if (result !== null) {
        let cloudMessageDto = {
          userId: result.userId,
          content: "Chào mừng bạn đến cloud",
          Type: "text",
        };
        const resultCloudeMessage = await dispatch(
          CreateCloudMessage(cloudMessageDto)
        ).unwrap();
        if (resultCloudeMessage) {
          let conversationDto = {
            id: result.userId,
            userId: result.userId,
            avatar: config.CLOUD_AVATAR,
            conversationName: "Cloud của tôi",
            userSend: "Cloud",
            type: "cloud",
            content: "Chào mừng bạn đến cloud",
          };
          await dispatch(CreateConversation(conversationDto)).unwrap();
        }
      }
      navigate("/login");
      toast.success("Đăng Ký Tài Khoản Thành Công");
    } catch (ex) {
      console.log(ex);
      toast.error("Đăng ký không thành công");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/premium-photo/graphic-chat-bubble-with-blue-background_875969-39.jpg')",
      }}
    >
      <div className="max-w-md w-full p-8 rounded-2xl shadow-2xl bg-white/40 backdrop-blur-lg border border-white/50">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Đăng Ký
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <img
              src={avatarPreview}
              alt="Avatar Preview"
              className="w-28 h-28 rounded-full border-4 border-blue-400 shadow-lg object-cover hover:scale-105 transition-transform"
            />
            <input
              {...register("avatar")}
              type="file"
              accept="image/*"
              className="hidden"
              id="avatarUpload"
              onChange={handleAvatarChange}
            />
            <label
              htmlFor="avatarUpload"
              className="mt-3 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg cursor-pointer hover:opacity-90 transition"
            >
              Chọn ảnh
            </label>
          </div>

          {/* Username */}
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-gray-400" />
            <input
              {...register("userName", { required: "Username is required" })}
              className="w-full pl-10 p-2 border border-gray-300 rounded-lg bg-white/70 shadow-sm focus:outline-none focus:border-gray-400 focus:ring-0"

              type="text"
              placeholder="Nhập tên"
            />
            {errors.userName && (
              <p className="text-red-500 text-sm mt-1">{errors.userName.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="relative">
            <FaPhone className="absolute left-3 top-3 text-gray-400" />
            <input
              {...register("phoneNumber", {
                required: "Phone number is required",
                pattern: {
                  value: /^(0[3-9])[0-9]{8}$/,
                  message: "Số điện thoại không hợp lệ",
                },
              })}
              className="w-full pl-10 p-2 border border-gray-300 rounded-lg bg-white/70 shadow-sm focus:outline-none focus:border-gray-400 focus:ring-0"

              type="text"
              placeholder="Nhập số điện thoại"
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>
            )}
          </div>

          {/* Sex */}
          <div className="relative">
            <MdWc className="absolute left-3 top-3 text-gray-400" />
            <select
              {...register("sex")}
              className="w-full pl-10 p-2 border border-gray-300 rounded-lg bg-white/70 shadow-sm focus:outline-none focus:border-gray-400 focus:ring-0"

            >
              <option value="Other">Không</option>
              <option value="Male">Nam</option>
              <option value="Female">Nữ</option>
            </select>
          </div>

          {/* Birthday */}
          <div className="relative">
            <FaBirthdayCake className="absolute left-3 top-3 text-gray-400" />
            <input
              {...register("birthday", { required: "Birthday is required" })}
              className="w-full pl-10 p-2 border border-gray-300 rounded-lg bg-white/70 shadow-sm focus:outline-none focus:border-gray-400 focus:ring-0"

              type="date"
            />
            {errors.birthday && (
              <p className="text-red-500 text-sm mt-1">{errors.birthday.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              {...register("password", { required: "Password is required" })}
              className="w-full pl-10 p-2 border border-gray-300 rounded-lg bg-white/70 shadow-sm focus:outline-none focus:border-gray-400 focus:ring-0"

              type="password"
              placeholder="Nhập mật khẩu"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isUploading}
              className={`flex-1 p-2 rounded-lg shadow-md transition ${
                isUploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:opacity-90"
              }`}
            >
              {isUploading ? "Đang tải ảnh..." : "Đăng Ký"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="flex-1 p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition shadow-md"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
