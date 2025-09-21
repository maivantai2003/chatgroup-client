import { useEffect, useState, useRef } from "react";
import { XCircle, Video, VideoOff, Minimize2, Maximize2, Mic, MicOff } from "lucide-react";

const VideoCallModal = ({
  localVideoRef,
  remoteVideoRef,
  localStream,
  remoteStream,
  onEndCall,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [microOn, setMicroOn] = useState(true); // trạng thái micro
  const boxSize = { width: 300, height: 200 };

  // trạng thái kéo-thả khi minimized
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const dragRef = useRef(null);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

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

  const toggleCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setCameraOn((prev) => !prev);
    }
  };

  const toggleMicro = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setMicroOn((prev) => !prev);
    }
  };

  // --- Drag handlers ---
  const handleMouseDown = (e) => {
    if (!isMinimized) return;
    isDragging.current = true;
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;

    const newX = e.clientX - offset.current.x;
    const newY = e.clientY - offset.current.y;

    const boxWidth = Math.min(boxSize.width, window.innerWidth * 0.9);
    const boxHeight = Math.min(boxSize.height, window.innerHeight * 0.4);

    const clampedX = Math.max(0, Math.min(newX, window.innerWidth - boxWidth));
    const clampedY = Math.max(0, Math.min(newY, window.innerHeight - boxHeight));

    setPosition({ x: clampedX, y: clampedY });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      ref={dragRef}
      onMouseDown={handleMouseDown}
      style={
        isMinimized
          ? {
              left: position.x,
              top: position.y,
              width: `${boxSize.width}px`,
              height: `${boxSize.height}px`,
              maxWidth: "90vw",
              maxHeight: "40vh",
              position: "fixed",
              zIndex: 9999,
              cursor: "move",
            }
          : {}
      }
      className={`fixed z-50 transition-all ${
        isMinimized
          ? "rounded-xl shadow-xl bg-white"
          : "inset-0 flex items-center justify-center p-4" // nền trong suốt
      }`}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col w-full max-w-4xl max-h-[90vh] ${
          isMinimized ? "h-full" : "space-y-4"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2 px-4 cursor-default">
          <h2 className="text-lg font-semibold text-gray-800">
            Cuộc gọi video
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(!isMinimized);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              {isMinimized ? <Maximize2 size={22} /> : <Minimize2 size={22} />}
            </button>
            <button
              onClick={onEndCall}
              className="text-red-500 hover:text-red-600 transition-all"
            >
              <XCircle size={28} />
            </button>
          </div>
        </div>

        {/* Video area */}
        <div className="flex-1 relative bg-black rounded-xl overflow-hidden">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          {!remoteStream && (
            <span className="absolute inset-0 flex items-center justify-center text-white text-base italic">
              Đang chờ người kia kết nối...
            </span>
          )}

          {/* Local video thumbnail */}
          <div className="absolute bottom-2 right-2 w-24 h-24 rounded-md overflow-hidden border-2 border-white shadow-lg">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            {!cameraOn && (
              <span className="absolute inset-0 flex items-center justify-center text-white text-sm bg-black bg-opacity-70">
                
                <VideoOff size={20}/>
              </span>
            )}
            {!microOn && (
              <span className="absolute top-1 left-1 flex items-center justify-center text-white text-sm bg-black bg-opacity-70 px-1 rounded">
                Mic tắt
              </span>
            )}
          </div>
        </div>

        {/* Controls */}
        {!isMinimized && (
          <div className="flex justify-center space-x-6 pt-2">
            <button
              onClick={toggleCamera}
              className="bg-gray-200 hover:bg-gray-300 p-3 rounded-full"
            >
              {cameraOn ? (
                <Video size={24} className="text-gray-700" />
              ) : (
                <VideoOff size={24} className="text-red-500" />
              )}
            </button>
            <button
              onClick={toggleMicro}
              className="bg-gray-200 hover:bg-gray-300 p-3 rounded-full"
            >
              {microOn ? (
                <Mic size={24} className="text-gray-700" />
              ) : (
                <MicOff size={24} className="text-red-500" />
              )}
            </button>
            <button
              onClick={onEndCall}
              className="bg-red-500 hover:bg-red-600 p-3 rounded-full text-white"
            >
              <XCircle size={26} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCallModal;
