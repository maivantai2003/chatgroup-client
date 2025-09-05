import { useState } from "react";
import Avatar from "./Avatar";
import { getTimeAgo } from "../helpers/convertTime";
import { useEffect } from "react";

const ListConversationItem = ({
  id,
  avatar,
  conversationName,
  content,
  userSend,
  lastMessage,
  onClick,
  isSelected,
}) => {
  const [timeAgo, setTimeAgo] = useState(getTimeAgo(lastMessage));
  useEffect(() => {
    setTimeAgo(getTimeAgo(lastMessage));
    const interval = setInterval(() => {
      setTimeAgo(getTimeAgo(lastMessage));
    }, 10000);
    return () => clearInterval(interval);
  }, [lastMessage, id]);
  return (
    <div className={`p-2 ${isSelected ? "bg-blue-100" : ""}`} onClick={onClick}>
      <div className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
        <img
          src={
            avatar !== null
              ? avatar
              : "https://res.cloudinary.com/dktn4yfpi/image/upload/v1740899136/bv3ndtwp1sosxw9sdvzj.jpg"
          }
          alt={conversationName}
          className="w-12 h-12 rounded-full object-cover"
        />

        <div className="ml-3 flex flex-col w-full">
          <div className="flex justify-between items-center">
            <div className="flex-1 min-w-0">
              <span className="text-gray-900 font-semibold truncate block">
                {conversationName}
              </span>
            </div>
            <span className="text-xs text-gray-400 whitespace-nowrap pl-2 shrink-0">
              {timeAgo}
            </span>
          </div>
          <div className="text-sm text-gray-600 truncate overflow-hidden whitespace-nowrap max-w-[200px]">
            <span className="font-semibold">
              {userSend === "" || userSend === null ? "" : userSend + ":"}
            </span>{" "}
            {content.includes("[image]") ? "📷 Hình ảnh" : content}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ListConversationItem;
