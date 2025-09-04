
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../components/Avatar";
import Header from "./Header";
import SelectMethod from "./SelectMethod";
import { useContext, useEffect, useState } from "react";
import { GetCloudMessagesById } from "../redux/cloudmessage/cloudmessageSlice";
import UserMessages from "../components/UserMessages";
import GroupMessages from "../components/GroupMessages";
import CloudMessages from "../components/CloudMessages";
import EmptyChatPlaceholder from "../components/EmptyChatPlaceholder";
import useVideoCall from "../hooks/useVideoCall";
import signalRService from "../services/signalRService";
const ChatMessage = ({ conversation,onToggleInfor }) => {
  const connection=useContext(signalRService);
  console.log(conversation)
  const {
    localVideoRef,
    remoteVideoRef,
    inCall,
    startCall,
    handleReceiveCall,
    handleCallAnswered,
    handleReceiveCandidate,
    acceptCall,
    rejectCall
  } = useVideoCall(conversation.id);
  const [incomingCall, setIncomingCall] = useState(null);
  useEffect(() => {

    if (!conversation) return;
    if (!connection) return;
    if (!connection) return;

    // có cuộc gọi đến
    const onReceiveCall = (data) => {
      setIncomingCall(data); // {CallerId, CallerName, Offer}
      handleReceiveCall(data, false); // chuẩn bị peer, chưa gửi answer vội
    };
    const onCallAnswered = (data) => handleCallAnswered(data);
    const onReceiveCandidate = (data) => handleReceiveCandidate(data);

    connection.on("ReceiveCall", onReceiveCall);
    connection.on("CallAnswered", onCallAnswered);
    connection.on("ReceiveCandidate", onReceiveCandidate);

    return () => {
      connection.off("ReceiveCall", onReceiveCall);
      connection.off("CallAnswered", onCallAnswered);
      connection.off("ReceiveCandidate", onReceiveCandidate);
    };
  }, [handleReceiveCall, handleCallAnswered, handleReceiveCandidate]);
  const renderMessages = () => {
    switch (conversation.type) {
      case "user":
        return <UserMessages {...conversation} />;
      case "group":
        return <GroupMessages {...conversation} />;
      case "cloud":
        return <CloudMessages {...conversation} />;
      default:
        return <EmptyChatPlaceholder />;
    }
  };
  return (
    <div className="flex-1 flex flex-col h-full">
      <Header
        avatar={
          conversation.avatar !== null
            ? conversation.avatar
            : "https://res.cloudinary.com/dktn4yfpi/image/upload/v1740899136/bv3ndtwp1sosxw9sdvzj.jpg"
        }
        name={conversation.conversationName}
        type={conversation.type}
        id={conversation.id}
        onToggleInfor={onToggleInfor}
        onVideoCall={() => startCall(conversation.id)}
      />
      <div className="flex-1 p-4 overflow-y-auto">{renderMessages()}</div>
      <div className="sticky bottom-0 w-full bg-white">
        <SelectMethod {...conversation} />
      </div>
       {incomingCall && !inCall && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center space-y-4">
            <p className="text-lg font-semibold">
              📞 {incomingCall.CallerName} đang gọi cho bạn...
            </p>
            <div className="flex justify-center space-x-6">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
                onClick={() => {
                  acceptCall(incomingCall);
                  setIncomingCall(null);
                }}
              >
                ✅ Chấp nhận
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
                onClick={() => {
                  rejectCall(incomingCall);
                  setIncomingCall(null);
                }}
              >
                ❌ Từ chối
              </button>
            </div>
          </div>
        </div>
      )}

      {/* hiển thị video khi đang call */}
      {inCall && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className={`relative w-full max-w-4xl flex flex-col items-center ${inCall ? "block" : "hidden"}`}>
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg shadow-lg"
            />
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-40 h-40 absolute bottom-4 right-4 rounded-lg shadow-md border-2 border-white"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
