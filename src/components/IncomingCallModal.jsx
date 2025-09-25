// components/IncomingCallModal.jsx
import React from "react";

const IncomingCallModal = ({ callerName, callerAvatar, onAccept, onReject }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center transform transition-transform duration-300 scale-95 animate-scaleIn">
        
        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <img
            src={callerAvatar || "/default-avatar.png"}
            alt={callerName}
            className="w-20 h-20 rounded-full object-cover border-4 border-indigo-500"
          />
        </div>

        {/* Caller Name */}
        <h2 className="text-2xl font-bold mb-2 text-gray-800">{callerName}</h2>
        <p className="text-gray-600 mb-6">đang gọi cho bạn</p>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onAccept}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-semibold shadow-md transition-transform transform hover:scale-105"
          >
            Chấp nhận
          </button>
          <button
            onClick={onReject}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-semibold shadow-md transition-transform transform hover:scale-105"
          >
            Từ chối
          </button>
        </div>
      </div>

      {/* Tailwind animation */}
      <style>
        {`
          @keyframes scaleIn {
            0% { transform: scale(0.9); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-scaleIn {
            animation: scaleIn 0.25s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default IncomingCallModal;
