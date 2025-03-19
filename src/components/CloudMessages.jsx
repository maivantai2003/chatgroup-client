import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetCloudMessagesById } from "../redux/cloudmessage/cloudmessageSlice";
import { formatTime } from "../helpers/formatTime";
import { groupMessagesByDate } from "../helpers/groupMessageByDate";
import FileMessage from "./FileMessage";
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
  const [loading,setLoading]=useState(true)
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(GetCloudMessagesById(userId));
      setLoading(false);
    };
    fetchData();
  }, [dispatch, userId, type]);
  useEffect(() => {
    if (messagesEndRef.current && containerRef.current) {
      setTimeout(() => {
        messagesEndRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 100);
    }
  }, [listCloudMessage]);
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
    <div className="flex flex-col space-y-2 p-4 min-h-screen overflow-y-auto" ref={containerRef}>
      {loading ? (
        // Hiển thị spinner khi loading
        <div className="flex justify-center items-center h-screen">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        Object.keys(groupedMessages).map((date, index) => (
          <div key={index + 1}>
            <div className="flex justify-center my-2">
              <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full shadow-sm">
                {date}
              </div>
            </div>

            {groupedMessages[date].map((msg) => (
              <div
                key={msg.cloudMessageId}
                className="flex items-center justify-end relative group"
                onMouseEnter={() => setHoveredMessage(msg.cloudMessageId)}
                onMouseLeave={() => setHoveredMessage(null)}
              >
                <div
                  className={`flex space-x-2 bg-white p-1 rounded-full shadow-md transition-opacity duration-200 ${
                    hoveredMessage === msg.cloudMessageId
                      ? "opacity-100"
                      : "opacity-0"
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

                <div className="bg-blue-100 border border-blue-300 rounded-lg p-2 max-w-xs relative ml-2">
                  {/* <p className="text-gray-900">{msg.content}</p> */}
                  {msg.content && <p className="text-sm">{msg.content}</p>}

                  {msg.files && msg.files.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {msg.files.map((file, index) => (
                        <FileMessage key={index} file={file} />
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 text-left">
                    {formatTime(msg.createAt)}
                  </p>
                  {messageReactions[msg.cloudMessageId] &&
                    Object.keys(messageReactions[msg.cloudMessageId]).length >
                      0 && (
                      <div className="flex space-x-1 mt-1 bg-white px-2 py-1 rounded-full shadow-md">
                        {Object.entries(
                          messageReactions[msg.cloudMessageId]
                        ).map(([reaction, count]) => (
                          <span
                            key={reaction}
                            className="text-xl flex items-center space-x-1"
                          >
                            {reaction}{" "}
                            <span className="text-xs text-gray-700">
                              {count}
                            </span>
                          </span>
                        ))}
                      </div>
                    )}
                  <div
                    className={`absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 bg-white p-1 rounded-full shadow-md transition-opacity duration-200 ${
                      hoveredMessage === msg.cloudMessageId
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  >
                    <button
                      className="p-1 hover:bg-gray-200 rounded-full"
                      onClick={() =>
                        setShowReactions((prev) =>
                          prev === msg.cloudMessageId ? null : msg.cloudMessageId
                        )
                      }
                    >
                      <Smile size={16} className="text-gray-600" />
                    </button>
                    {showReactions === msg.cloudMessageId && (
                      <div className="absolute bottom-full mb-2 right-0 bg-white p-2 rounded-full shadow-lg flex space-x-2">
                        {reactions.map((emoji, index) => (
                          <button
                            key={index}
                            className="text-xl hover:scale-110 transition-transform"
                            onClick={() =>
                              handleReaction(msg.cloudMessageId, emoji)
                            }
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
        ))
      )}
    </div>
  );
};

export default CloudMessages;
