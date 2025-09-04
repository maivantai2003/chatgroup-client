import { useRef, useState, useContext } from "react";
import { SignalRContext } from "../context/SignalRContext";

const useVideoCall = (targetUserId) => {
  const connection = useContext(SignalRContext);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const [inCall, setInCall] = useState(false);

  const startCall = async () => {
    peerConnectionRef.current = new RTCPeerConnection();

    // lấy stream local
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    stream.getTracks().forEach(track =>
      peerConnectionRef.current.addTrack(track, stream)
    );

    // gán stream vào local video nếu đã có ref
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    // remote stream
    peerConnectionRef.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // ICE Candidate
    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        connection.invoke("SendIceCandidate", targetUserId, JSON.stringify(event.candidate));
      }
    };

    // tạo offer
    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);

    // gửi offer qua server
    connection.invoke("CallUser", targetUserId, "myUserId", "My Name", JSON.stringify(offer));

    setInCall(true);
  };

  const handleReceiveCall = async ({ CallerId, CallerName, Offer }) => {
    peerConnectionRef.current = new RTCPeerConnection();

    // local stream
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    stream.getTracks().forEach(track =>
      peerConnectionRef.current.addTrack(track, stream)
    );
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    peerConnectionRef.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        connection.invoke("SendIceCandidate", CallerId, JSON.stringify(event.candidate));
      }
    };

    await peerConnectionRef.current.setRemoteDescription(JSON.parse(Offer));
    const answer = await peerConnectionRef.current.createAnswer();
    await peerConnectionRef.current.setLocalDescription(answer);

    connection.invoke("AnswerCall", CallerId, JSON.stringify(answer));
    setInCall(true);
  };

  const handleCallAnswered = async ({ Answer }) => {
    await peerConnectionRef.current.setRemoteDescription(JSON.parse(Answer));
  };

  const handleReceiveCandidate = async ({ Candidate }) => {
    try {
      await peerConnectionRef.current.addIceCandidate(JSON.parse(Candidate));
    } catch (err) {
      console.error("Error adding received candidate", err);
    }
  };

  const acceptCall = async (incomingCall) => {
    await handleReceiveCall(incomingCall);
  };

  const rejectCall = ({ CallerId }) => {
    connection.invoke("RejectCall", CallerId);
  };

  return {
    localVideoRef,
    remoteVideoRef,
    inCall,
    startCall,
    handleReceiveCall,
    handleCallAnswered,
    handleReceiveCandidate,
    acceptCall,
    rejectCall,
  };
};

export default useVideoCall;
