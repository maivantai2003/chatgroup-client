import React, { useEffect, useRef } from "react";

const VideoCallModal = ({ localVideoRef, remoteVideoRef, onEndCall }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.error("Không thể phát âm thanh:", err);
      });
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      {/* Chuông đổ */}
      <audio ref={audioRef} src="/ringtone.mp3" loop />

      {/* Khung gọi */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6 flex flex-col items-center space-y-6">
        {/* Tiêu đề và nút */}
        <div className="w-full flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Cuộc gọi video</h2>
          <button
            onClick={onEndCall}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow"
          >
            Kết thúc
          </button>
        </div>

        {/* Thông tin người gọi */}
        <div className="flex flex-col items-center space-y-1">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl text-gray-600 shadow">
            👤
          </div>
          <span className="text-lg font-medium text-gray-800">Người gọi</span>
          <span className="text-sm text-gray-500">Đang kết nối...</span>
        </div>

        {/* Video hiển thị */}
        <div className="w-full flex justify-between gap-4">
          {/* Local video */}
          <div className="flex-1 bg-black rounded-lg overflow-hidden border">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              className="w-full h-48 object-cover"
            />
          </div>

          {/* Remote video (chỉ hiển thị khi đã có kết nối) */}
          <div className="flex-1 bg-black rounded-lg overflow-hidden border">
            {remoteVideoRef?.current?.srcObject ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 flex items-center justify-center text-white text-sm italic">
                Đang chờ người kia kết nối...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCallModal;
