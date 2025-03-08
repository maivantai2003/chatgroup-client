import { useSelector } from "react-redux";

const UserMessages = ({ conversationId }) => {
  const messages = useSelector((state) =>
    state.messages.list.filter((msg) => msg.conversationId === conversationId)
  );

  return (
    <div>
      {messages.map((msg, index) => (
        <div key={index} className="p-2 bg-gray-100 rounded-lg mb-2">
          <p>{msg.content}</p>
        </div>
      ))}
    </div>
  );
};

export default UserMessages;
