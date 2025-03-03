import { useState } from "react";
import { FaUser, FaUsers, FaUserPlus, FaSignOutAlt } from "react-icons/fa"; // Import các icon từ react-icons/fa
import { useNavigate } from "react-router-dom";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
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
        <FaUsers className="w-6 h-6" />
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
        className={`p-2 rounded-full ${
          activeTab === "requests" ? "text-yellow-300" : "text-white"
        }`}
        onClick={() => setActiveTab("requests")}
      >
        <FaUserPlus className="w-6 h-6" />
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
