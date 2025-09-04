const VideoCallScreen = ({ localVideoRef, remoteVideoRef, onEndCall }) => {
  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Remote video full screen */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      {/* Local video nhỏ ở góc */}
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        className="absolute bottom-4 right-4 w-32 h-40 rounded-lg shadow-lg border-2 border-white"
      />
      {/* Button kết thúc */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <button
          onClick={onEndCall}
          className="p-4 bg-red-600 text-white rounded-full hover:bg-red-700"
        >
          ❌ Kết thúc
        </button>
      </div>
    </div>
  );
};

export default VideoCallScreen;
