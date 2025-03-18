import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  GetAllUserMessage,
  receiveUserMessage,
} from "../redux/usermessage/usermessageSlice";
import { formatTime } from "../helpers/formatTime";
import { groupMessagesByDate } from "../helpers/groupMessageByDate";
import { SignalRContext } from "../context/SignalRContext";
import FileMessage from "./FileMessage";

const UserMessages = ({ userId, id, type, avatar }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const connection = useContext(SignalRContext);
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const listUserMessage = useSelector(
    (state) => state.usermessage.listUserMessage
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(GetAllUserMessage({ senderId: userId, receiverId: id }));
      setLoading(false);
    };
    fetchData();
  }, [dispatch, userId, id, type]);
  useEffect(() => {
    if (connection) {
      connection.on("ReceiveUserMessage", (userMessage) => {
        dispatch(receiveUserMessage(userMessage));
        console.log(userMessage);
      });
      connection.on("CheckUser", (value) => {
        console.log(value);
      });
    }
    return () => {
      if (connection) {
        connection.off("ReceiveUserMessage");
        connection.off("CheckUser");
      }
    };
  }, [connection, dispatch, id]);
  useEffect(() => {
    if (messagesEndRef.current && containerRef.current) {
      setTimeout(() => {
        messagesEndRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 100); // Giảm delay để mượt hơn
    }
  }, [listUserMessage]); // Theo dõi khi danh sách tin nhắn thay đổi
  const filteredMessages = listUserMessage.filter(
    (msg) =>
      (msg.senderId === userId && msg.receiverId === id) ||
      (msg.senderId === id && msg.receiverId === userId)
  );
  const groupedMessages = groupMessagesByDate(filteredMessages);
  return (
    <div
      className="flex flex-col space-y-3 p-4 bg-gray-100 min-h-screen overflow-y-auto"
      ref={containerRef}
    >
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        Object.keys(groupedMessages).map((date, index) => (
          <div key={index}>
            {/* Hiển thị ngày tin nhắn */}
            <div className="flex justify-center my-2">
              <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full shadow-sm">
                {date}
              </div>
            </div>
            {/* Hiển thị tin nhắn trong ngày */}
            {groupedMessages[date].map((msg) => (
              <div
                key={msg.userMessageId}
                className={`flex items-end space-x-2 ${
                  msg.senderId === userId ? "justify-end" : "justify-start"
                } mb-2`}
              >
                {/* Avatar nếu là tin nhắn của người khác */}
                {msg.senderId !== userId && (
                  <img
                    src={avatar || "/default-avatar.png"}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                {/* Nội dung tin nhắn */}
                <div
                  className={`p-3 max-w-xs md:max-w-md rounded-lg border shadow-sm ${
                    msg.senderId === userId
                      ? "bg-blue-100 border-blue-300 text-black"
                      : "bg-gray-100 border-gray-300 text-black"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  {/* Nếu có file đính kèm */}
                  {msg.files && msg.files.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {msg.files.map((file, index) => (
                        <FileMessage key={index} file={file} />
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 text-right mt-1">
                    {formatTime(msg.createAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
      <div ref={messagesEndRef}></div>
    </div>
  );
};

export default UserMessages;
