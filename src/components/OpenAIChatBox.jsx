// src/components/ChatWidgetWrapper.jsx
import { useState } from "react";
import { FaTimes, FaRobot } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import OpenAIChatBox from "./OpenAIChatBox";

const ChatWidgetWrapper = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            key="chatbox"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="w-[380px] h-[520px] bg-white rounded-2xl shadow-xl flex flex-col border"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-2 rounded-t-2xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
              <div className="flex items-center gap-2 font-semibold">
                <FaRobot /> ChatAI
              </div>
              <button
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full"
                onClick={() => setIsOpen(false)}
              >
                <FaTimes />
              </button>
            </div>

            {/* Body chat */}
            <div className="flex-1 overflow-hidden">
              <OpenAIChatBox />
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="chatbutton"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90 text-white p-4 rounded-full shadow-lg"
            aria-label="Mở chat"
          >
            <FaRobot className="text-xl" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatWidgetWrapper;
