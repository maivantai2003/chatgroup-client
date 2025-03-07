import { useSelector } from "react-redux";

const GroupMessages = ({ conversationId }) => {
  const messages = useSelector((state) =>
    state.groupMessages.list.filter((msg) => msg.conversationId === conversationId)
  );

  return (
    <div>
      {messages.map((msg, index) => (
        <div key={index} className="p-2 bg-blue-100 rounded-lg mb-2">
          <strong>{msg.senderName}:</strong> {msg.content}
        </div>
      ))}
    </div>
  );
};

export default GroupMessages;
