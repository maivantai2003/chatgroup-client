import { useState } from "react";
import Avatar from "./Avatar";
import { getTimeAgo } from "../helpers/convertTime";
import { useEffect } from "react";

const ListGroupItem = ({
  id,
  avatar,
  conversationName,
  content,
  userSend,
  lastMessage,
  onClick,
  isSelected
}) => {
  const [timeAgo, setTimeAgo] = useState(getTimeAgo(lastMessage));
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(getTimeAgo(lastMessage));
    }, 60000); // 60s

    return () => clearInterval(interval);
  }, [lastMessage]);
  return (
    <div className={`p-2 ${isSelected ? "bg-gray-200" : ""}`} onClick={onClick}>
      <div className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
        {/* Ảnh đại diện tròn */}
        <img
          src={avatar}
          alt={conversationName}
          className="w-12 h-12 rounded-full object-cover"
        />

        <div className="ml-3 flex flex-col w-full">
          <div className="flex justify-between items-center">
            <span className="font-bold">{conversationName}</span>
            <span className="text-xs text-gray-400">{timeAgo}</span>
          </div>

          <div className="text-sm text-gray-600">
            <span className="font-semibold">{userSend}:</span>{" "}
            {content.includes("[image]") ? "📷 Hình ảnh" : content}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ListGroupItem;
