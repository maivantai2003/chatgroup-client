import React, { useState, useRef, useEffect } from "react";
import { formatTime } from "../helpers/formatTime";

const reactions = ["👍", "❤️", "😂", "😮", "😢", "😡"];

const MessageBubble = ({
  msg,
  userId,
  avatar,
  onReact,
  onCopy,
  onDelete,
  onMore,
}) => {
  const [showReactions, setShowReactions] = useState(false);
  const reactionRef = useRef(null);
  const hideTimerRef = useRef(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => clearTimeout(hideTimerRef.current);
  }, []);

  // Click outside => close popup
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (reactionRef.current && !reactionRef.current.contains(e.target)) {
        setShowReactions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openReactions = () => {
    clearTimeout(hideTimerRef.current);
    setShowReactions(true);
  };
  const delayedCloseReactions = () => {
    clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setShowReactions(false), 120); // 120ms delay
  };

  return (
    <div
      className={`relative group flex items-end space-x-2 mb-2 ${
        msg.senderId === userId ? "justify-end" : "justify-start"
      }`}
    >
      {/* Avatar nếu là tin nhắn của người khác */}
      {msg.senderId !== userId && (
        <img
          src={avatar || "/default-avatar.png"}
          alt="Avatar"
          className="w-8 h-8 rounded-full object-cover"
        />
      )}

      {/* Bubble tin nhắn */}
      <div
        className={`p-3 max-w-xs md:max-w-md rounded-lg border shadow-sm ${
          msg.senderId === userId
            ? "bg-blue-100 border-blue-300 text-black"
            : "bg-gray-100 border-gray-300 text-black"
        }`}
      >
        {msg.content && <p className="text-sm">{msg.content}</p>}
        <p className="text-xs text-gray-500 text-right mt-1">
          {formatTime(msg.createAt)}
        </p>
      </div>

      {/* Action menu */}
      <div
        className={`absolute hidden group-hover:flex space-x-2 -top-8 z-10
          ${msg.senderId === userId ? "right-0" : "left-0"}
          bg-white shadow-md rounded-lg p-1`}
      >
        {/* Reaction wrapper: đặt button + popup cùng 1 vùng để giữ hover */}
        <div
          ref={reactionRef}
          className="relative inline-flex items-center"
          onMouseEnter={openReactions}
          onMouseLeave={delayedCloseReactions}
          onTouchStart={(e) => {
            // mobile: toggle on touch
            e.stopPropagation();
            setShowReactions((s) => !s);
          }}
        >
          <button
            type="button"
            className="text-yellow-500 hover:scale-110 transition px-1"
            aria-label="Open reactions"
          >
            😀
          </button>

          {/* Popup reaction - render bên trong cùng wrapper => không bị mất khi di chuột */}
          {showReactions && (
            <div
              className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2
                         flex space-x-2 bg-white shadow-lg rounded-full p-2 z-20
                         select-none"
              // prevent the popup itself from triggering document click close immediately
              onMouseEnter={openReactions}
              onMouseLeave={delayedCloseReactions}
            >
              {reactions.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className="text-xl p-1 hover:scale-125 transition"
                  onClick={() => {
                    onReact?.(msg, emoji);
                    setShowReactions(false);
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Copy */}
        <button
          className="text-gray-600 hover:text-black px-1"
          onClick={() => onCopy?.(msg)}
        >
          📋
        </button>

        {/* Delete */}
        <button
          className="text-red-500 hover:text-red-700 px-1"
          onClick={() => onDelete?.(msg)}
        >
          🗑️
        </button>

        {/* More */}
        <button
          className="text-gray-500 hover:text-black px-1"
          onClick={() => onMore?.(msg)}
        >
          ⋮
        </button>
      </div>
    </div>
  );
};

export default MessageBubble;
