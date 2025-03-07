
import { useState, useEffect } from "react";
import GroupInfo from "./GroupInfor";
import UserInfo from "./UserInfor";
import CloudInfo from "./CloudInfor";

const InforChat = ({ conversation }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (conversation) {
      setTimeout(() => setLoading(false), 10);
    }
  }, [conversation]);

  if (loading) {
    return <div className="p-4 animate-pulse">Loading...</div>;
  }

  return (
    <div className="w-1/4 bg-white p-4">
      {conversation.type === "group" ? (
        <GroupInfo conversation={conversation} />
      ) : conversation.type === "cloud" ? (  
        <CloudInfo conversation={conversation} />
      ) : (
        <UserInfo conversation={conversation} />
      )}
    </div>
  );
};

export default InforChat;
