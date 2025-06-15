// hooks/useWebRTC.js
import { useRef } from "react";
import {
  callUser,
  answerCall,
  sendCandidate,
  getConnectionId,
} from "../services/signalr";

const config = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export const useWebRTC = ({ localVideoRef, remoteVideoRef }) => {
  const pc = useRef(null);

  const setupPeerConnection = () => {
    pc.current = new RTCPeerConnection(config);

    pc.current.onicecandidate = (e) => {
      if (e.candidate) {
        sendCandidate(currentRemoteId.current, e.candidate);
      }
    };

    pc.current.ontrack = (e) => {
      remoteVideoRef.current.srcObject = e.streams[0];
    };

    const stream = localVideoRef.current.srcObject;
    stream.getTracks().forEach((track) =>
      pc.current.addTrack(track, stream)
    );
  };

  const currentRemoteId = useRef(null);

  const startCall = async (toUserId) => {
    setupPeerConnection();
    currentRemoteId.current = toUserId;

    const offer = await pc.current.createOffer();
    await pc.current.setLocalDescription(offer);
    callUser(toUserId, offer);
  };

  const handleReceiveCall = async (fromConnectionId, offer) => {
    currentRemoteId.current = fromConnectionId;
    setupPeerConnection();

    await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.current.createAnswer();
    await pc.current.setLocalDescription(answer);
    answerCall(fromConnectionId, answer);
  };

  const handleReceiveAnswer = async (answer) => {
    await pc.current.setRemoteDescription(new RTCSessionDescription(answer));
  };

  const handleReceiveCandidate = async (candidate) => {
    await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
  };

  return {
    startCall,
    handleReceiveCall,
    handleReceiveAnswer,
    handleReceiveCandidate,
  };
};
