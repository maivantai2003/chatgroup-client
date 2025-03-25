import { useState } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa"; // Import icon edit
import config from "../constant/linkApi";
import { useDispatch } from "react-redux";
import { UpdateUser } from "../redux/user/userSlice";
import { toast } from "react-toastify";
import { updateUserInfo } from "../helpers/convert";
import { UpdateConversationInfor } from "../redux/conversation/conversationSlice";

const EditProfileModal = ({ isOpen, closeModal, user }) => {
  const [formData, setFormData] = useState({ ...user });
  const [avatarPreview, setAvatarPreview] = useState(user.avatar);
  const [coverPreview, setCoverPreview] = useState(user.coverPhoto);
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "avatar") {
          setAvatarPreview(reader.result);
          setAvatarFile(file);
        } else {
          setCoverPreview(reader.result);
          setCoverFile(file);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${config.API_URL}/File/Upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.url;
    } catch (error) {
      console.error("Upload ảnh thất bại:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const avatarUrl = avatarFile
        ? await uploadImage(avatarFile)
        : formData.avatar;
      const coverUrl = coverFile
        ? await uploadImage(coverFile)
        : formData.coverPhoto;

      const updatedData = {
        ...formData,
        avatar: avatarUrl,
        coverPhoto: coverUrl,
      };
      let userUpdateDto = {
        userId: updatedData.userId,
        userName: updatedData.userName,
        bio: updatedData.bio,
        avatar: updatedData.avatar,
        sex: updatedData.sex,
        coverPhoto: updatedData.coverPhoto,
        birthday: updatedData.birthday,
        phoneNumber: updatedData.phoneNumber,
        status: 1,
      };
      console.log("Dữ liệu gửi lên server:", updatedData);
      console.log(updatedData.userId, userUpdateDto);
      console.log(localStorage.getItem("user"))
      try {
        var result = await dispatch(
          UpdateUser({ id: updatedData.userId, userUpdateDto: userUpdateDto })
        ).unwrap();
        if (result !== null) {
          console.log(result)
          toast.success("Cập nhật thành công");
          updateUserInfo(userUpdateDto)
          console.log(localStorage.getItem("user"))
        } else {
          toast.error("Cập nhật không thành công");
          return;
        }
        var resultUpdateInfor=await dispatch(UpdateConversationInfor({
          id:userUpdateDto.userId,
          type:"user",
          avatar:userUpdateDto.avatar,
          conversationName:userUpdateDto.userName
        }))
        console.log(resultUpdateInfor)
      } catch (ex) {
        console.log(ex);
      }
      closeModal();
    } catch (error) {
      console.error("Lỗi cập nhật thông tin:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-md flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Chỉnh sửa thông tin</h2>

        {/* Ảnh bìa */}
        <div className="relative w-full h-32 bg-gray-200 rounded overflow-hidden">
          {coverPreview && (
            <img
              src={coverPreview}
              alt="Cover"
              className="w-full h-full object-cover rounded"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, "coverPhoto")}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />

          {/* Icon Edit */}
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 p-2 rounded-full cursor-pointer">
            <FaEdit className="text-white" />
          </div>
        </div>

        {/* Ảnh đại diện */}
        <div className="relative flex justify-center mt-4">
          <div className="relative w-24 h-24 rounded-full border-2 border-white overflow-hidden">
            {avatarPreview && (
              <img
                src={avatarPreview}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, "avatar")}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />

            {/* Icon Edit */}
            <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 p-2 rounded-full cursor-pointer">
              <FaEdit className="text-white text-sm" />
            </div>
          </div>
        </div>

        {/* Hiển thị trạng thái loading */}
        {loading && (
          <p className="text-center text-sm text-blue-500 mt-2">
            Đang cập nhật...
          </p>
        )}

        {/* Form chỉnh sửa thông tin */}
        <form onSubmit={handleSubmit} className="space-y-3 mt-4">
          {/* Tên người dùng */}
          <div>
            <label className="block text-gray-600 text-sm">
              Tên người dùng
            </label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={(e) =>
                setFormData({ ...formData, userName: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-gray-600 text-sm">Bio</label>
            <input
              type="text"
              name="bio"
              value={formData.bio === "None" ? "" : formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Giới tính */}
          <div>
            <label className="block text-gray-600 text-sm">Giới tính</label>
            <select
              name="sex"
              value={formData.sex}
              onChange={(e) =>
                setFormData({ ...formData, sex: e.target.value })
              }
              className="w-full p-2 border rounded bg-white"
            >
              <option value="">Chọn giới tính</option>
              <option value="Male">Nam</option>
              <option value="Female">Nữ</option>
              <option value="Other">Khác</option>
            </select>
          </div>

          {/* Số điện thoại */}
          <div>
            <label className="block text-gray-600 text-sm">Số điện thoại</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Ngày sinh */}
          <div>
            <label className="block text-gray-600 text-sm">Ngày sinh</label>
            <input
              type="date"
              name="birthday"
              value={formData.birthday?.split("T")[0]}
              onChange={(e) =>
                setFormData({ ...formData, birthday: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={closeModal}
              className="p-2 bg-gray-300 rounded"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
