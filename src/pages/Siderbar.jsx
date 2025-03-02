import { useState } from "react";
import { UserIcon, UsersIcon, UserPlusIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ activeTab, setActiveTab }) => {
  //const [activeTab, setActiveTab] = useState("message");
  const navigate=useNavigate()
  const handleLogout = () => {
    navigate("/login")
  };

  return (
    <div className="w-1/22 bg-blue-400 text-white flex flex-col h-screen p-2">
        <button
        className={`flex items-center p-2 space-x-2 ${
          activeTab === "message" ? "text-yellow-300" : "text-black"
        }`}
        onClick={() => setActiveTab("message")}
      >
        <UsersIcon className="w-5 h-5" />
        {/* <span className="text-sm">Tin nhắn</span> */}
      </button>
      <button
        className={`flex items-center p-2 space-x-2 ${
          activeTab === "friends" ? "text-yellow-300" : "text-black"
        }`}
        onClick={() => setActiveTab("friends")}
      >
        <UserIcon className="w-5 h-5" />
        {/* <span className="text-sm">Bạn bè</span> */}
      </button>

      <button
        className={`flex items-center p-2 space-x-2 ${
          activeTab === "groups" ? "text-yellow-300" : "text-black"
        }`}
        onClick={() => setActiveTab("groups")}
      >
        <UsersIcon className="w-5 h-5" />
        {/* <span className="text-sm">Nhóm</span> */}
      </button>

      <button
        className={`flex items-center p-2 space-x-2 ${
          activeTab === "requests" ? "text-yellow-300" : "text-black"
        }`}
        onClick={() => setActiveTab("requests")}
      >
        <UserPlusIcon className="w-5 h-5" />
        {/* <span className="text-sm">Lời mời</span> */}
      </button>
      {/* Nút Đăng xuất */}
      <button
        className="flex items-center p-2 space-x-2 text-black hover:text-red-500 mt-auto"
        onClick={handleLogout}
      >
        <ArrowRightOnRectangleIcon className="w-5 h-5" />
        <span className="text-sm">logout</span>
      </button>
    </div>
  );
};

export default Sidebar;
