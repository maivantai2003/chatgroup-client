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
    setTimeAgo(getTimeAgo(lastMessage));
    const interval = setInterval(() => {
      setTimeAgo(getTimeAgo(lastMessage));
    }, 10000);
    return () => clearInterval(interval);
  }, [lastMessage,id]);
  return (
    <div className={`p-2 ${isSelected ? "bg-blue-100" : ""}`} onClick={onClick}>
      <div className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
        <img
          src={avatar!==null?avatar:"https://res.cloudinary.com/dktn4yfpi/image/upload/v1740899136/bv3ndtwp1sosxw9sdvzj.jpg"}
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
