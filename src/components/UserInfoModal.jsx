import React from "react";

const UserInfoModal = ({ user, onClose }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (!user) return null;
  console.log(user)
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-md z-50">
      <div className="bg-white w-[420px] h-[520px] rounded-lg shadow-lg">
        {/* Header */}
        <div className="relative">
          <img
            src={user.coverPhoto ? user.coverPhoto : "/src/assets/images/defaultBackground.jpg"}
            alt="Cover"
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <button
            className="absolute top-2 right-2 bg-gray-200 p-2 rounded-full"
            onClick={onClose}
          >
            ✕
          </button>
          <br />
          <div className="absolute -bottom-10 left-4 flex items-center">
            <img
              src={user.avatar ? user.avatar : "/src/assets/images/defaultBackground.jpg"}
              alt="Avatar"
              className="w-20 h-20 rounded-full border-4 border-white"
            />
            <div className="ml-4">
              <h2 className="text-lg font-semibold">{user.userName}</h2>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 mt-8">
          {/* Nút gọi điện & nhắn tin */}
          {/* <div className="flex justify-between">
            <button className="flex-1 py-2 border rounded-md mr-2">📞 Gọi điện</button>
            <button className="flex-1 py-2 bg-blue-500 text-white rounded-md">💬 Nhắn tin</button>
          </div> */}

          {/* Thông tin cá nhân */}
          <div className="mt-4 border-t pt-4">
            <h3 className="text-gray-600 font-semibold">Thông tin cá nhân</h3>
            <p className="flex justify-between mt-2"><span>Giới tính:</span> <span>{user.sex === "Male" ? "Nam" : "Nữ"}</span></p>
            <p className="flex justify-between mt-1"><span>Ngày sinh:</span> <span>{formatDate(user.birthday)}</span></p>
            <p className="flex justify-between mt-1"><span>Điện thoại:</span> <span>******</span></p>
          </div>
          {/* Hình ảnh */}
          {/* <div className="mt-4 border-t pt-4">
            <h3 className="text-gray-600 font-semibold">Hình ảnh</h3>
            <p className="text-gray-500 mt-2">Chưa có ảnh nào được chia sẻ</p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default UserInfoModal;
