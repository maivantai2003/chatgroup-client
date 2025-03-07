import { useState,useEffect } from "react";
import {
  FaUser,
  FaUsers,
  FaUserPlus,
  FaSignOutAlt,
  FaRegComment,
} from "react-icons/fa"; // Import các icon từ react-icons/fa
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const friendRequests = useSelector((state) => state.friend.listFriendRequest);
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <div className="w-20 bg-blue-500 text-white flex flex-col h-screen p-2 items-center space-y-6">
      <button
        className={`p-2 rounded-full ${
          activeTab === "message" ? "text-yellow-300" : "text-white"
        }`}
        onClick={() => setActiveTab("message")}
      >
        <FaRegComment className="w-6 h-6" />
      </button>

      <button
        className={`p-2 rounded-full ${
          activeTab === "friends" ? "text-yellow-300" : "text-white"
        }`}
        onClick={() => setActiveTab("friends")}
      >
        <FaUser className="w-6 h-6" />
      </button>

      <button
        className={`p-2 rounded-full ${
          activeTab === "groups" ? "text-yellow-300" : "text-white"
        }`}
        onClick={() => setActiveTab("groups")}
      >
        <FaUsers className="w-6 h-6" />
      </button>

      <button
        className={`relative p-2 rounded-full ${
          activeTab === "requests" ? "text-yellow-300" : "text-white"
        }`}
        onClick={() => setActiveTab("requests")}
      >
        <FaUserPlus className="w-6 h-6" />
        {friendRequests?.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full px-2">
            {friendRequests.length > 5 ? "+5" : friendRequests.length}
          </span>
        )}
      </button>

      {/* Nút Đăng xuất */}
      <button
        className="p-2 rounded-full text-white hover:text-red-500 mt-auto"
        onClick={handleLogout}
      >
        <FaSignOutAlt className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Sidebar;
