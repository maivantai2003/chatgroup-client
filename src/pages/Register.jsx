import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {registerUser} from "../redux/auth/authSlice"
const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [avatarPreview, setAvatarPreview] = useState("https://res.cloudinary.com/dktn4yfpi/image/upload/v1740748643/lui1zw6ip7ew5modhzsg.png"); // Ảnh mặc định
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const user=useSelector((state)=>state.auth.register)
  //const register=useSelector((state)=>state.auth.register)
  // Xử lý khi chọn ảnh mới
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file)); // Cập nhật ảnh hiển thị
    }
  };

  const onSubmit =async (data) => {
    console.log(data.avatar)
    console.log("Form Data:", data);
    let userRegister={
      userName:data.userName,
      sex:data.sex,
      phoneNumber:data.phoneNumber,
      birthday:data.birthday,
      avatar:"https://res.cloudinary.com/dktn4yfpi/image/upload/v1740748643/lui1zw6ip7ew5modhzsg.png"
    }
    console.log(userRegister)
    const result=await dispatch(registerUser(userRegister))
    console.log(result)
    navigate("/login")
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Đăng Ký</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Avatar Preview */}
        <div className="flex flex-col items-center">
          <img
            src={avatarPreview}
            alt="Avatar Preview"
            className="w-24 h-24 rounded-full border border-gray-300 object-cover"
          />

          {/* Ẩn input file và tạo nút chọn ảnh */}
          <input
            {...register("avatar")}
            type="file"
            accept="image/*"
            className="hidden" // Ẩn input file
            id="avatarUpload"
            onChange={handleAvatarChange}
          />

          {/* Nút chọn ảnh */}
          <label
            htmlFor="avatarUpload"
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition"
          >
            Chọn ảnh
          </label>
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium">Username</label>
          <input
            {...register("userName", { required: "Username is required" })}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            type="text"
            placeholder="Enter username"
          />
          {errors.userName && <p className="text-red-500 text-sm">{errors.userName.message}</p>}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium">Phone Number</label>
          <input
            {...register("phoneNumber")}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            type="text"
            placeholder="Enter phone number"
          />
        </div>

        {/* Bio */}
        {/* <div>
          <label className="block text-sm font-medium">Bio</label>
          <textarea
            {...register("bio")}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Tell us about yourself"
          />
        </div> */}

        {/* Sex */}
        <div>
          <label className="block text-sm font-medium">Sex</label>
          <select
            {...register("sex")}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="Other">Không</option>
            <option value="Male">Nam</option>
            <option value="Female">Nữ</option>
          </select>
        </div>

        {/* Birthday */}
        <div>
          <label className="block text-sm font-medium">Birthday</label>
          <input
            {...register("birthday", { required: "Birthday is required" })}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            type="date"
          />
          {errors.birthday && <p className="text-red-500 text-sm">{errors.birthday.message}</p>}
        </div>

        {/* Cover Photo */}
        {/* <div>
          <label className="block text-sm font-medium">Cover Photo</label>
          <input
            {...register("coverPhoto")}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            type="file"
          />
        </div> */}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
        >
          Đăng Ký
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
