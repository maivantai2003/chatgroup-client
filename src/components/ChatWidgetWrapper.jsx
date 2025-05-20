// src/components/ChatWidgetWrapper.jsx
import { useState } from "react";
import { FaComments, FaTimes } from "react-icons/fa";
import OpenAIChatBox from "./OpenAIChatBox";

const ChatWidgetWrapper = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="relative w-[400px] h-[520px] bg-gray-400 rounded-lg shadow-lg">
          {/* Nút đóng */}
          <div className="text-white text-lg font-semibold bg-gray-700 py-2 px-4 rounded-t-lg">
      ChatAI
    </div>
          <button
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full z-10"
            onClick={() => setIsOpen(false)}
          >
            <FaTimes />
          </button>

          {/* Giao diện Chat */}
          <div className="w-full h-full pt-10 px-2">
            <OpenAIChatBox />
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gray-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-lg"
          aria-label="Mở chat"
        >
          {/* <FaComments size={24} /> */}
          <i className="fas fa-robot" size={30}></i>
        </button>
      )}
    </div>
  );
};

export default ChatWidgetWrapper;
