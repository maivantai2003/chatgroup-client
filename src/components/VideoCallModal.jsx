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
  const [microOn, setMicroOn] = useState(true);

  const boxSize = { width: 300, height: 200 };
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const dragRef = useRef(null);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (localVideoRef.current && localStream) localVideoRef.current.srcObject = localStream;
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) remoteVideoRef.current.srcObject = remoteStream;
  }, [remoteStream]);

  const toggleCamera = () => {
    if (!localStream) return;
    localStream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
    setCameraOn(prev => !prev);
  };

  const toggleMicro = () => {
    if (!localStream) return;
    localStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
    setMicroOn(prev => !prev);
  };

  // --- Drag handlers ---
  const handleMouseDown = (e) => {
    if (!isMinimized) return;
    isDragging.current = true;
    offset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;

    const newX = e.clientX - offset.current.x;
    const newY = e.clientY - offset.current.y;

    const clampedX = Math.max(0, Math.min(newX, window.innerWidth - boxSize.width));
    const clampedY = Math.max(0, Math.min(newY, window.innerHeight - boxSize.height));

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
              position: "fixed",
              zIndex: 9999,
              cursor: "move",
              transition: "all 0.2s ease",
            }
          : {}
      }
      className={`fixed z-50 ${
        isMinimized ? "rounded-xl shadow-xl bg-white" : "inset-0 flex items-center justify-center p-2"
      }`}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col w-full max-w-4xl max-h-[90vh] transition-all ${
          isMinimized ? "h-full" : "space-y-2"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b rounded-t-2xl">
          <h2 className="text-md font-semibold text-gray-800">
            {isMinimized ? "" : "Cuộc gọi video"}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(!isMinimized);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              {isMinimized ? <Maximize2 size={20} /> : <Minimize2 size={20} />}
            </button>
            <button onClick={onEndCall} className="text-red-500 hover:text-red-600">
              <XCircle size={24} />
            </button>
          </div>
        </div>

        {/* Video Area */}
        <div className="flex-1 relative bg-black rounded-xl overflow-hidden">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          {!remoteStream && (
            <span className="absolute inset-0 flex items-center justify-center text-white text-sm italic">
              Đang chờ kết nối...
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
              <span className="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-70">
                <VideoOff size={18} />
              </span>
            )}
            {!microOn && (
              <span className="absolute top-1 left-1 flex items-center justify-center text-white text-xs bg-black bg-opacity-70 px-1 rounded">
                Mic tắt
              </span>
            )}
          </div>
        </div>

        {/* Controls */}
        {!isMinimized && (
          <div className="flex justify-center space-x-4 py-2">
            <button
              onClick={toggleCamera}
              className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full transition-transform hover:scale-105"
            >
              {cameraOn ? <Video size={20} className="text-gray-700" /> : <VideoOff size={20} className="text-red-500" />}
            </button>
            <button
              onClick={toggleMicro}
              className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full transition-transform hover:scale-105"
            >
              {microOn ? <Mic size={20} className="text-gray-700" /> : <MicOff size={20} className="text-red-500" />}
            </button>
            <button
              onClick={onEndCall}
              className="bg-red-500 hover:bg-red-600 p-2 rounded-full text-white transition-transform hover:scale-105"
            >
              <XCircle size={22} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCallModal;
