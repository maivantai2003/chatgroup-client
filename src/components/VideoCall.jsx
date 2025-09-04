
import { useVideoCall } from "../hooks/useVideoCall";

const VideoCall = ({ toUserId }) => {
  const {
    localVideoRef,
    remoteVideoRef,
    startCall,
    acceptCall,
    endCall,
    incomingCall,
    callActive,
  } = useVideoCall(toUserId);

  return (
    <div>
      <div>
        <video ref={localVideoRef} autoPlay playsInline muted />
        <video ref={remoteVideoRef} autoPlay playsInline />
      </div>

      {!callActive && !incomingCall && (
        <button onClick={startCall}>📞 Gọi</button>
      )}

      {incomingCall && (
        <div>
          <p>📲 Có cuộc gọi đến!</p>
          <button onClick={acceptCall}>✅ Trả lời</button>
          <button onClick={endCall}>❌ Từ chối</button>
        </div>
      )}

      {callActive && <button onClick={endCall}>❌ Kết thúc</button>}
    </div>
  );
};

export default VideoCall;
