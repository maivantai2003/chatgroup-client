
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../components/Avatar";
import Header from "./Header";
import SelectMethod from "./SelectMethod";
import { useEffect } from "react";
import { GetCloudMessagesById } from "../redux/cloudmessage/cloudmessageSlice";
import UserMessages from "../components/UserMessages";
import GroupMessages from "../components/GroupMessages";
import CloudMessages from "../components/CloudMessages";
import EmptyChatPlaceholder from "../components/EmptyChatPlaceholder";
import useVideoCall from "../hooks/useVideoCall";
import IncomingCallModal from "../components/IncomingCallModal";
import VideoCallModal from "../components/VideoCallModal";
//import MessageItem from "./MessageItem";

const ChatMessage = ({ conversation,onToggleInfor }) => {
  const {
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
  } = useVideoCall(conversation.id.toString());
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
        onStartCall={startCall}
        onToggleInfor={onToggleInfor}

      />
      <div className="flex-1 p-4 overflow-y-auto">{renderMessages()}</div>
      <div className="sticky bottom-0 w-full bg-white">
        <SelectMethod {...conversation} />
      </div>

      {isInCall && (
        <VideoCallModal
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
          onEndCall={endCall}
          localStream={localStream}
          remoteStream={remoteStream}
        />
      )}
      {incomingCall && (
        <IncomingCallModal
          callerName={"Người dùng " + incomingCall.fromUserId}
          onAccept={acceptCall}
          onReject={rejectCall}
        />
      )}
    </div>
  );
};

export default ChatMessage;
