// src/components/ChatWidgetWrapper.jsx
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import OpenAIChatBox from "./OpenAIChatBox";

const ChatWidgetWrapper = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 sm:bottom-15 right-4 z-50">
      {isOpen ? (
        <div className="relative w-[400px] h-[520px] bg-gray-100 rounded-lg shadow-lg flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center bg-gray-700 text-white px-4 py-2 rounded-t-lg">
            <span className="font-semibold">Chat</span>
            <button
              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
              onClick={() => setIsOpen(false)}
            >
              <FaTimes />
            </button>
          </div>

          {/* Body chat chiếm toàn bộ phần còn lại */}
          <div className="flex-1 overflow-hidden">
            <OpenAIChatBox />
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gray-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-lg"
          aria-label="Mở chat"
        >
          <i className="fas fa-robot text-xl"></i>
        </button>
      )}
    </div>
  );
};

export default ChatWidgetWrapper;
