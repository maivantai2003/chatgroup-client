import { useRef, useEffect, useContext, useState } from "react";
import { SignalRContext } from "../context/SignalRContext";

const useVideoCall = (toUserId) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const connection = useContext(SignalRContext);
  const [incomingCall, setIncomingCall] = useState(null);
  const [isInCall, setIsInCall] = useState(false);
  //new
  useEffect(() => {
    let timeout;
    if (isInCall && !incomingCall) {
      timeout = setTimeout(() => {
        console.log("Không nhận phản hồi, kết thúc cuộc gọi");
        endCall();
      }, 30000);
    }
    return () => clearTimeout(timeout);
  }, [isInCall, incomingCall]);
  //
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
  const cleanUpMedia = () => {
    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current?.srcObject) {
      remoteVideoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      remoteVideoRef.current.srcObject = null;
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
  };
  const startCall = async () => {
    try {
      cleanUpMedia();
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
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          // Nếu cần hỗ trợ TURN server:
          // {
          //   urls: "turn:your.turn.server:3478",
          //   username: "user",
          //   credential: "pass"
          // }
        ],
      });
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
      //new
      pc.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };
      //
      await connection.invoke("SendCallRequest", toUserId);
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      console.log("SendOffer to:", toUserId);
      connection.invoke("SendOffer", toUserId, JSON.stringify(offer));
      setIsInCall(true);
    } catch (error) {
      console.error("Lỗi khi bắt đầu cuộc gọi:", error);
      alert("Không thể truy cập thiết bị (camera/mic).");
    }
  };
  const handleCallRequest = (fromUserId) => {
    console.log("Cuộc gọi đến từ:", fromUserId);
    setIncomingCall({ fromUserId });
  };

  const handleReceiveOffer = async (fromUserId, offer) => {
    console.log("Receive offer from:", fromUserId);
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        // Nếu cần hỗ trợ TURN server:
        // {
        //   urls: "turn:your.turn.server:3478",
        //   username: "user",
        //   credential: "pass"
        // }
      ],
    });
    peerConnectionRef.current = pc;
    //new
    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };
    //
    await pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(offer)));

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    //old
    //localVideoRef.current.srcObject = stream;
    //new
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
    //
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    connection.invoke("SendAnswer", fromUserId, JSON.stringify(answer));
    //new
    setIsInCall(true);
    //
  };

  const handleReceiveAnswer = async (fromUserId, answer) => {
    await peerConnectionRef.current.setRemoteDescription(
      new RTCSessionDescription(JSON.parse(answer))
    );
  };

  const handleReceiveIceCandidate = async (fromUserId, candidate) => {
    console.log(fromUserId);
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
    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
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

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    //new
    setIsInCall(true);
    //
  };
  const rejectCall = () => {
    setIncomingCall(null);
    setIsInCall(true);
    // Optional: Gửi tín hiệu từ chối nếu cần
  };
  const endCall = () => {
    console.log("Kết thúc cuộc gọi");

    // Ngắt tất cả track video/audio local
    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach((track) => {
        track.stop();
      });
      localVideoRef.current.srcObject = null;
    }

    // Ngắt tất cả track video/audio remote
    if (remoteVideoRef.current?.srcObject) {
      remoteVideoRef.current.srcObject.getTracks().forEach((track) => {
        track.stop();
      });
      remoteVideoRef.current.srcObject = null;
    }

    // Đóng peer connection nếu còn tồn tại
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Báo server nếu cần
    // connection.invoke("EndCall", toUserId); (tuỳ bạn có xử lý gì không)

    // Tắt modal gọi
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
