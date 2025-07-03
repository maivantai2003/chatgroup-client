import { useEffect } from "react";
import { XCircle } from "lucide-react";

const VideoCallModal = ({
  localVideoRef,
  remoteVideoRef,
  localStream,
  remoteStream,
  onEndCall,
}) => {
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-6 flex flex-col space-y-6">
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-2xl font-semibold text-gray-800">Cuộc gọi video</h2>
          <button onClick={onEndCall} className="text-red-500 hover:text-red-600 transition-all">
            <XCircle size={36} />
          </button>
        </div>

        <div className="flex flex-col items-center space-y-2">
          <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-4xl text-gray-700 shadow-inner">
            👤
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-800">Người gọi</p>
            <p className="text-sm text-gray-500 italic">
              {remoteStream ? "Đã kết nối hình ảnh" : "Đang chờ người kia kết nối..."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black rounded-xl overflow-hidden border-2 border-gray-300">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-56 md:h-64 object-cover"
            />
          </div>

          <div className="bg-black rounded-xl overflow-hidden border-2 border-gray-300 relative">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-56 md:h-64 object-cover"
            />
            {!remoteStream && (
              <span className="absolute inset-0 flex items-center justify-center text-white text-base italic">
                Đang chờ người kia kết nối...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCallModal;



// import React, { useEffect, useRef } from "react";

// const VideoCallModal = ({ localVideoRef, remoteVideoRef, onEndCall }) => {
//   const audioRef = useRef(null);

//   useEffect(() => {
//     if (audioRef.current) {
//       audioRef.current.play().catch((err) => {
//         console.error("Không thể phát âm thanh:", err);
//       });
//     }
//   }, []);

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
//       {/* Chuông đổ */}
//       <audio ref={audioRef} src="/ringtone.mp3" loop />

//       {/* Khung gọi */}
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6 flex flex-col items-center space-y-6">
//         {/* Tiêu đề và nút */}
//         <div className="w-full flex justify-between items-center">
//           <h2 className="text-xl font-semibold text-gray-800">Cuộc gọi video</h2>
//           <button
//             onClick={onEndCall}
//             className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow"
//           >
//             Kết thúc
//           </button>
//         </div>

//         {/* Thông tin người gọi */}
//         <div className="flex flex-col items-center space-y-1">
//           <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl text-gray-600 shadow">
//             👤
//           </div>
//           <span className="text-lg font-medium text-gray-800">Người gọi</span>
//           <span className="text-sm text-gray-500">Đang kết nối...</span>
//         </div>

//         {/* Video hiển thị */}
//         <div className="w-full flex justify-between gap-4">
//           {/* Local video */}
//           <div className="flex-1 bg-black rounded-lg overflow-hidden border">
//             <video
//               ref={localVideoRef}
//               autoPlay
//               muted
//               className="w-full h-48 object-cover"
//             />
//           </div>

//           {/* Remote video (chỉ hiển thị khi đã có kết nối) */}
//           <div className="flex-1 bg-black rounded-lg overflow-hidden border">
//             {remoteVideoRef?.current?.srcObject ? (
//               <video
//                 ref={remoteVideoRef}
//                 autoPlay
//                 className="w-full h-48 object-cover"
//               />
//             ) : (
//               <div className="w-full h-48 flex items-center justify-center text-white text-sm italic">
//                 Đang chờ người kia kết nối...
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VideoCallModal;
