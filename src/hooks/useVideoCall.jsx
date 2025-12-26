import { useRef, useEffect, useContext, useState } from "react";
import { SignalRContext } from "../context/SignalRContext";

const useVideoCall = (toUserId) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const fromUserIdRef = useRef(null);
  const pendingOfferRef = useRef(null); // Lưu offer tạm thời

  const connection = useContext(SignalRContext);

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [isInCall, setIsInCall] = useState(false);

  useEffect(() => {
    if (!connection) return;

    connection.on("ReceiveCallRequest", handleCallRequest);
    connection.on("ReceiveOffer", handleReceiveOffer);
    connection.on("ReceiveAnswer", handleReceiveAnswer);
    connection.on("ReceiveIceCandidate", handleReceiveIceCandidate);
    connection.on("CallRejected", handleCallRejected);

    return () => {
      connection.off("ReceiveCallRequest", handleCallRequest);
      connection.off("ReceiveOffer", handleReceiveOffer);
      connection.off("ReceiveAnswer", handleReceiveAnswer);
      connection.off("ReceiveIceCandidate", handleReceiveIceCandidate);
      connection.off("CallRejected", handleCallRejected);
    };
  }, [connection]);

  const cleanUpMedia = () => {
    localStreamRef.current?.getTracks().forEach(t => t.stop());
    localStreamRef.current = null;

    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;

    setLocalStream(null);
    setRemoteStream(null);
    setIsInCall(false);
    setIncomingCall(null);
    fromUserIdRef.current = null;
    pendingOfferRef.current = null;
  };

  const getMediaStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localStreamRef.current = stream;
    setLocalStream(stream);
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    return stream;
  };

  const createPeerConnection = (remoteUserId) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });

    pc.onicecandidate = event => {
      if (event.candidate) {
        connection.invoke("SendIceCandidate", remoteUserId, JSON.stringify(event.candidate));
      }
    };

    pc.ontrack = event => {
      const remote = event.streams[0];
      setRemoteStream(remote);
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remote;
    };

    peerConnectionRef.current = pc;
    return pc;
  };

  // --- Caller ---
  const startCall = async () => {
    try {
      setIsInCall(true);
      await connection.invoke("SendCallRequest", toUserId);
      const pc = createPeerConnection(toUserId);
      const stream = await getMediaStream();
      stream.getTracks().forEach(track => pc.addTrack(track, stream));
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await connection.invoke("SendOffer", toUserId, JSON.stringify(offer));
    } catch (err) {
      console.error(err);
      cleanUpMedia();
    }
  };

  // --- Receiver ---
  const handleCallRequest = (fromUserId) => {
    setIncomingCall({ fromUserId });
    fromUserIdRef.current = fromUserId;
  };

  const handleReceiveOffer = (fromUserId, offer) => {
    fromUserIdRef.current = fromUserId;
    pendingOfferRef.current = offer;
    setIncomingCall({ fromUserId });
  };

  const acceptCall = async () => {
    try {
      setIncomingCall(null);
      setIsInCall(true);

      const offer = pendingOfferRef.current;
      const fromUserId = fromUserIdRef.current;

      const pc = createPeerConnection(fromUserId);
      const stream = await getMediaStream();
      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      await pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(offer)));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      await connection.invoke("SendAnswer", fromUserId, JSON.stringify(answer));
    } catch (err) {
      console.error(err);
      cleanUpMedia();
    }
  };

  const rejectCall = async () => {
    await connection.invoke("RejectCall", fromUserIdRef.current);
    cleanUpMedia();
  };

  const handleReceiveAnswer = async (fromUserId, answer) => {
    try {
      const pc = peerConnectionRef.current;
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(answer)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReceiveIceCandidate = async (fromUserId, candidate) => {
    try {
      const pc = peerConnectionRef.current;
      if (pc) {
        await pc.addIceCandidate(new RTCIceCandidate(JSON.parse(candidate)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCallRejected = (fromUserId) => {
    console.log("Call rejected by:", fromUserId);
    cleanUpMedia();
  };

  const endCall = () => {
    cleanUpMedia();
  };

  return {
    startCall,
    acceptCall,
    rejectCall,
    endCall,
    isInCall,
    incomingCall,
    localVideoRef,
    remoteVideoRef,
    localStream,
    remoteStream,
  };
};

export default useVideoCall;
