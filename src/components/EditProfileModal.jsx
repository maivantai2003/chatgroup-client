import { useState } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
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
    if (!file) return;

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
  };

  const uploadImage = async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${config.API_URL}/File/Upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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
      const avatarUrl = avatarFile ? await uploadImage(avatarFile) : formData.avatar;
      const coverUrl = coverFile ? await uploadImage(coverFile) : formData.coverPhoto;

      const userUpdateDto = {
        userId: formData.userId,
        userName: formData.userName,
        bio: formData.bio,
        avatar: avatarUrl,
        sex: formData.sex,
        coverPhoto: coverUrl,
        birthday: formData.birthday,
        phoneNumber: formData.phoneNumber,
        status: 1,
      };

      const result = await dispatch(UpdateUser({ id: formData.userId, userUpdateDto })).unwrap();

      if (result) {
        toast.success("Cập nhật thành công");
        updateUserInfo(userUpdateDto);

        await dispatch(
          UpdateConversationInfor({
            id: userUpdateDto.userId,
            type: "user",
            avatar: userUpdateDto.avatar,
            conversationName: userUpdateDto.userName,
          })
        );
      } else {
        toast.error("Cập nhật không thành công");
        return;
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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
          ✨ Chỉnh sửa thông tin
        </h2>

        {/* Cover photo */}
        <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden group">
          {coverPreview && (
            <img
              src={coverPreview}
              alt="Cover"
              className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, "coverPhoto")}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <div className="absolute bottom-2 right-2 bg-black/60 p-2 rounded-full opacity-0 group-hover:opacity-100 transition">
            <FaEdit className="text-white text-sm" />
          </div>
        </div>

        {/* Avatar */}
        <div className="relative flex justify-center -mt-12">
          <div className="relative w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden group">
            {avatarPreview && (
              <img
                src={avatarPreview}
                alt="Avatar"
                className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, "avatar")}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="absolute bottom-1 right-1 bg-black/60 p-2 rounded-full opacity-0 group-hover:opacity-100 transition">
              <FaEdit className="text-white text-xs" />
            </div>
          </div>
        </div>

        {loading && (
          <p className="text-center text-sm text-blue-500 mt-2">Đang cập nhật...</p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Tên người dùng</label>
            <input
              type="text"
              value={formData.userName}
              onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Bio</label>
            <input
              type="text"
              value={formData.bio === "None" ? "" : formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Giới tính</label>
            <select
              value={formData.sex}
              onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
              className="w-full p-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="">Chọn giới tính</option>
              <option value="Male">Nam</option>
              <option value="Female">Nữ</option>
              <option value="Other">Khác</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Số điện thoại</label>
            <input
              type="text"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Ngày sinh</label>
            <input
              type="date"
              value={formData.birthday?.split("T")[0]}
              onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-lg transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
