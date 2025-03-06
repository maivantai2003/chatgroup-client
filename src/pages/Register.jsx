import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {registerUser} from "../redux/auth/authSlice"
import axios from "axios";
import config from "../constant/linkApi";
import { toast } from "react-toastify";
import { CreateCloudMessage } from "../redux/cloudmessage/cloudmessageSlice";
import { CreateConversation } from "../redux/conversation/conversationSlice";
const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const DEFAULT_AVATAR = "https://res.cloudinary.com/dktn4yfpi/image/upload/v1740748643/lui1zw6ip7ew5modhzsg.png";
  const [avatarPreview, setAvatarPreview] = useState(DEFAULT_AVATAR);
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const user=useSelector((state)=>state.auth.register)
  const [avatarFile, setAvatarFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  //const register=useSelector((state)=>state.auth.register)
  // Xử lý khi chọn ảnh mới
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
      const response = await axios.post( `${config.API_URL}/File/Upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setIsUploading(false);
      return response.data.url;
    } catch (error) {
      console.error("Upload ảnh thất bại", error);
      return avatarPreview;
    }
  };


  const onSubmit =async (data) => {
    const avatarUrl = await uploadAvatar();
    console.log(data.avatar)
    console.log("Form Data:", data);
    let userRegister={
      userName:data.userName,
      sex:data.sex,
      phoneNumber:data.phoneNumber,
      birthday:data.birthday,
      avatar:avatarUrl
    }
    try{
      const result=await dispatch(registerUser(userRegister)).unwrap()
      if(result!==null){
        let cloudMessageDto={
          userId:result.userId,
          content:"Chào mừng bạn đến cloud",
          Type:"text"
        }
        const resultCloudeMessage=await dispatch(CreateCloudMessage(cloudMessageDto)).unwrap()
        if(resultCloudeMessage!==null && resultCloudeMessage.cloudMessageId!=0){
          let conversationDto={
            id:result.userId,
            userId:result.userId,
            avatar:"https://res.cloudinary.com/dktn4yfpi/image/upload/v1741155183/ocivujn3qq5pxv6ngnau.jpg",
            conversationName:"Cloud của tôi",
            userSend:"Cloud",
            type:"user",
            content:"Chào mừng bạn đến cloud"
          }
          var resultConversation=await dispatch(CreateConversation(conversationDto)).unwrap()
          if(resultConversation==null){
            toast.error("Lỗi")
            return
          }
        }

      }
      navigate("/login")
    }catch(ex){
      console.log(ex)
      toast.error("Đăng ký không thành công")
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Đăng Ký</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col items-center">
          <img
            src={avatarPreview}
            alt="Avatar Preview"
            className="w-24 h-24 rounded-full border border-gray-300 object-cover"
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
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition"
          >
            Chọn ảnh
          </label>
        </div>
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
        <div>
          <label className="block text-sm font-medium">Phone Number</label>
          <input
            {...register("phoneNumber")}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            type="text"
            placeholder="Enter phone number"
          />
        </div>
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
        <div>
          <label className="block text-sm font-medium">Birthday</label>
          <input
            {...register("birthday", { required: "Birthday is required" })}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            type="date"
          />
          {errors.birthday && <p className="text-red-500 text-sm">{errors.birthday.message}</p>}
        </div>
        <button type="submit" disabled={isUploading} className={`w-full p-2 rounded-lg transition ${isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}>
          {isUploading ? "Đang tải ảnh..." : "Đăng Ký"}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
