import { useState } from "react";
import {
  FaUser,
  FaUsers,
  FaUserPlus,
  FaSignOutAlt,
  FaRegComment,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SignalRService from "../services/signalRService";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const friendRequests = useSelector((state) => state.friend.listFriendRequest);

  const handleLogout = async () => {
    await SignalRService.stopConnection();
    localStorage.clear();
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  return (
    <div className="w-15 bg-blue-700 text-white flex flex-col h-screen p-2 items-center space-y-6">
      {[
        { id: "message", icon: <FaRegComment className="w-6 h-6" /> },
        { id: "friends", icon: <FaUser className="w-6 h-6" /> },
        { id: "groups", icon: <FaUsers className="w-6 h-6" /> },
        {
          id: "requests",
          icon: <FaUserPlus className="w-6 h-6" />,
          badge: friendRequests?.length > 0 ? friendRequests.length : null,
        },
      ].map(({ id, icon, badge }) => (
        <button
          key={id}
          className={`p-2 rounded-full relative ${
            activeTab === id
              ? "bg-white text-blue-700 rounded-xl p-3"
              : "text-white"
          }`}
          onClick={() => setActiveTab(id)}
        >
          {icon}
          {badge && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full px-2">
              {badge > 5 ? "+5" : badge}
            </span>
          )}
        </button>
      ))}

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
