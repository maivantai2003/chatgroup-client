import { useRef, useEffect, useContext, useState } from "react";
import { SignalRContext } from "../context/SignalRContext";

const useVideoCall = (toUserId) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);

  const connection = useContext(SignalRContext);

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const [incomingCall, setIncomingCall] = useState(null);
  const [isInCall, setIsInCall] = useState(false);
  const [fromUserIdRef, setFromUserIdRef] = useState(null);

  useEffect(() => {
    if (!connection) return;

    connection.on("ReceiveCallRequest", handleCallRequest);
    connection.on("ReceiveOffer", handleReceiveOffer);
    connection.on("ReceiveAnswer", handleReceiveAnswer);
    connection.on("ReceiveIceCandidate", handleReceiveIceCandidate);

    return () => {
      connection.off("ReceiveCallRequest", handleCallRequest);
      connection.off("ReceiveOffer", handleReceiveOffer);
      connection.off("ReceiveAnswer", handleReceiveAnswer);
      connection.off("ReceiveIceCandidate", handleReceiveIceCandidate);
    };
  }, [connection]);

  const cleanUpMedia = () => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    setLocalStream(null);
    setRemoteStream(null);

    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
  };

  const getMediaStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      setLocalStream(stream);
      return stream;
    } catch (err) {
      console.error("❌ [getMediaStream] Error:", err);
      throw err;
    }
  };

  const createPeerConnection = (remoteUserId) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        connection.invoke("SendIceCandidate", remoteUserId, JSON.stringify(event.candidate));
      }
    };

    pc.ontrack = (event) => {
      const remote = event.streams[0];
      setRemoteStream(remote);
    };

    peerConnectionRef.current = pc;
    return pc;
  };

  const startCall = async () => {
    try {
      cleanUpMedia();
      const stream = await getMediaStream();
      const pc = createPeerConnection(toUserId);
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      await connection.invoke("SendCallRequest", toUserId);
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await connection.invoke("SendOffer", toUserId, JSON.stringify(offer));
      setIsInCall(true);
    } catch (err) {
      console.error("❌ [startCall] Error:", err);
      alert("Không thể truy cập camera hoặc micro.");
    }
  };

  const handleCallRequest = (fromUserId) => {
    setIncomingCall({ fromUserId });
    setFromUserIdRef(fromUserId);
  };

  const acceptCall = async () => {
    setIncomingCall(null);
  };

  const rejectCall = () => {
    setIncomingCall(null);
    cleanUpMedia();
  };

  const handleReceiveOffer = async (fromUserId, offer) => {
    try {
      cleanUpMedia();
      const stream = await getMediaStream();
      const pc = createPeerConnection(fromUserId);
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      await pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(offer)));

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      await connection.invoke("SendAnswer", fromUserId, JSON.stringify(answer));
      setIsInCall(true);
    } catch (err) {
      console.error("❌ [handleReceiveOffer] Error:", err);
    }
  };

  const handleReceiveAnswer = async (fromUserId, answer) => {
    try {
      const pc = peerConnectionRef.current;
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(answer)));
      }
    } catch (err) {
      console.error("❌ [handleReceiveAnswer] Error:", err);
    }
  };

  const handleReceiveIceCandidate = async (fromUserId, candidate) => {
    try {
      const pc = peerConnectionRef.current;
      if (pc) {
        await pc.addIceCandidate(new RTCIceCandidate(JSON.parse(candidate)));
      }
    } catch (err) {
      console.error("❌ [handleReceiveIceCandidate] Error:", err);
    }
  };

  const endCall = () => {
    cleanUpMedia();
    setIsInCall(false);
  };

  return {
    startCall,
    localVideoRef,
    remoteVideoRef,
    rejectCall,
    acceptCall,
    endCall,
    isInCall,
    incomingCall,
    localStream,
    remoteStream,
  };
};

export default useVideoCall;

