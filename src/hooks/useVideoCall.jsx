import { useRef, useEffect, useContext, useState } from "react";
import { SignalRContext } from "../context/SignalRContext";

const useVideoCall = (toUserId) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const connection = useContext(SignalRContext);
  const [incomingCall, setIncomingCall] = useState(null);
  const [isInCall, setIsInCall] = useState(false);

  useEffect(() => {
    if (!connection) return;
    connection.on("ReceiveCallRequest", handleCallRequest);
    connection.on("ReceiveOffer", handleReceiveOffer);
    connection.on("ReceiveAnswer", handleReceiveAnswer);
    connection.on("ReceiveIceCandidate", handleReceiveIceCandidate);

    return () => {
      connection.off("ReceiveCallRequest");
      connection.off("ReceiveOffer");
      connection.off("ReceiveAnswer");
      connection.off("ReceiveIceCandidate");
    };
  }, [connection]);

  const startCall = async () => {
    console.log(toUserId);
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    //localVideoRef.current.srcObject = stream;
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    } else {
      // Nếu chưa, delay 1 chút
      setTimeout(() => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      }, 100);
    }
    const pc = new RTCPeerConnection();
    peerConnectionRef.current = pc;

    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        connection.invoke(
          "SendIceCandidate",
          toUserId,
          JSON.stringify(event.candidate)
        );
      }
    };

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    connection.invoke("SendOffer", toUserId, JSON.stringify(offer));
    setIsInCall(true);
  };

  const handleCallRequest = (fromUserId) => {
    console.log("Cuộc gọi đến từ:", fromUserId);
    setIncomingCall({ fromUserId });
    // Hiển thị popup nhận cuộc gọi
  };

  const handleReceiveOffer = async (fromUserId, offer) => {
    const pc = new RTCPeerConnection();
    peerConnectionRef.current = pc;

    await pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(offer)));

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localVideoRef.current.srcObject = stream;
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    connection.invoke("SendAnswer", fromUserId, JSON.stringify(answer));
  };

  const handleReceiveAnswer = async (fromUserId, answer) => {
    await peerConnectionRef.current.setRemoteDescription(
      new RTCSessionDescription(JSON.parse(answer))
    );
  };

  const handleReceiveIceCandidate = async (fromUserId, candidate) => {
    console.log(fromUserId)
    await peerConnectionRef.current.addIceCandidate(
      new RTCIceCandidate(JSON.parse(candidate))
    );
  };
  const acceptCall = async () => {
    if (!incomingCall) return;
    const fromUserId = incomingCall.fromUserId;
    setIncomingCall(null); // Ẩn modal

    const pc = new RTCPeerConnection();
    peerConnectionRef.current = pc;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localVideoRef.current.srcObject = stream;
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    pc.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        connection.invoke(
          "SendIceCandidate",
          fromUserId,
          JSON.stringify(event.candidate)
        );
      }
    };
    setIsInCall(true);
  };
  const rejectCall = () => {
    setIncomingCall(null);
    setIsInCall(true);
    // Optional: Gửi tín hiệu từ chối nếu cần
  };
  const endCall = () => {
    // logic kết thúc
    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject
        .getTracks()
        .forEach((track) => track.stop());
      localVideoRef.current.srcObject = null;
    }

    // Dừng các track của remote video stream
    if (remoteVideoRef.current?.srcObject) {
      remoteVideoRef.current.srcObject
        .getTracks()
        .forEach((track) => track.stop());
      remoteVideoRef.current.srcObject = null;
    }

    // Đóng peer connection nếu còn
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
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
  };
};

export default useVideoCall;
