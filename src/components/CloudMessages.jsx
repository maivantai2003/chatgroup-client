import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetCloudMessagesById } from "../redux/cloudmessage/cloudmessageSlice";
import { formatTime } from "../helpers/formatTime";
import { groupMessagesByDate } from "../helpers/groupMessageByDate";
import { ThumbsUp, MessageCircle, MoreHorizontal, Smile } from "lucide-react"; // Import icon
const reactions = ["👍", "❤️", "🤣", "😲", "😭", "😡"];
const CloudMessages = ({ userId, type }) => {
  const listCloudMessage = useSelector(
    (state) => state.cloudmessage.listCloudMessage
  );
  const dispatch = useDispatch();
  
  const [hoveredMessage, setHoveredMessage] = useState(null);
  const [showReactions, setShowReactions] = useState(null);
  const [messageReactions, setMessageReactions] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(GetCloudMessagesById(userId));
    };
    fetchData();
  }, [dispatch, userId, type]);

  const filteredCloudMessages = listCloudMessage.filter(
    (conv) => conv.userId === userId
  );

  const groupedMessages = groupMessagesByDate(filteredCloudMessages);
  const handleReaction = (messageId, reaction) => {
    setMessageReactions((prev) => {
      const existingReactions = prev[messageId] || {};
      const updatedReactions = { ...existingReactions };

      if (updatedReactions[reaction]) {
        delete updatedReactions[reaction];
      } else {
        updatedReactions[reaction] = (existingReactions[reaction] || 0) + 1;
      }

      return { ...prev, [messageId]: updatedReactions };
    });
  };
  return (
    <div className="flex flex-col space-y-2 p-4">
      {Object.keys(groupedMessages).map((date, index) => (
        <div key={index + 1}>
          <div className="text-center text-gray-500 text-sm my-2">{date}</div>

          {groupedMessages[date].map((msg) => (
            <div
              key={msg.cloudMessageId}
              className="flex items-center justify-end relative group"
              onMouseEnter={() => setHoveredMessage(msg.cloudMessageId)}
              onMouseLeave={() => setHoveredMessage(null)}
            >
              {/* Biểu tượng bên trái */}
              <div
                className={`flex space-x-2 bg-white p-1 rounded-full shadow-md transition-opacity duration-200 ${
                  hoveredMessage === msg.cloudMessageId ? "opacity-100" : "opacity-0"
                }`}
              >
                <button className="p-1 hover:bg-gray-200 rounded-full">
                  <ThumbsUp size={16} className="text-gray-600" />
                </button>
                <button className="p-1 hover:bg-gray-200 rounded-full">
                  <MessageCircle size={16} className="text-gray-600" />
                </button>
                <button className="p-1 hover:bg-gray-200 rounded-full">
                  <MoreHorizontal size={16} className="text-gray-600" />
                </button>
              </div>

              {/* Tin nhắn */}
              <div className="bg-blue-100 border border-blue-300 rounded-lg p-2 max-w-xs relative ml-2">
                <p className="text-gray-900">{msg.content}</p>
                <p className="text-xs text-gray-500 text-left">
                  {formatTime(msg.createAt)}
                </p>
                {messageReactions[msg.cloudMessageId] &&
                  Object.keys(messageReactions[msg.cloudMessageId]).length > 0 && (
                    <div className="flex space-x-1 mt-1 bg-white px-2 py-1 rounded-full shadow-md">
                      {Object.entries(messageReactions[msg.cloudMessageId]).map(
                        ([reaction, count]) => (
                          <span key={reaction} className="text-xl flex items-center space-x-1">
                            {reaction} <span className="text-xs text-gray-700">{count}</span>
                          </span>
                        )
                      )}
                    </div>
                  )}
                {/* Biểu tượng chọn thả icon ở góc dưới bên phải */}
                <div
                  className={`absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 bg-white p-1 rounded-full shadow-md transition-opacity duration-200 ${
                    hoveredMessage === msg.cloudMessageId ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <button className="p-1 hover:bg-gray-200 rounded-full"
                  onClick={() =>
                    setShowReactions((prev) => (prev === msg.cloudMessageId ? null : msg.cloudMessageId))
                  }
                  >
                    <Smile size={16} className="text-gray-600" />
                  </button>
                   {/* Hiển thị reactions khi hover */}
                   {showReactions === msg.cloudMessageId && (
                    <div className="absolute bottom-full mb-2 right-0 bg-white p-2 rounded-full shadow-lg flex space-x-2">
                      {reactions.map((emoji, index) => (
                        <button
                          key={index}
                          className="text-xl hover:scale-110 transition-transform"
                          onClick={() => handleReaction(msg.cloudMessageId, emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CloudMessages;
