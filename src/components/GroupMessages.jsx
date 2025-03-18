import { useContext, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addGroupMessageRecevie, GetAllGroupMessage } from "../redux/groupmessage/groupmessageSlice";
import { formatTime } from "../helpers/formatTime";
import { groupMessagesByDate } from "../helpers/groupMessageByDate";
import { SignalRContext } from "../context/SignalRContext";
import FileMessage from "./FileMessage";

const GroupMessages = ({ userId, id }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const connection = useContext(SignalRContext);
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const listGroupMessage = useSelector(
    (state) => state.groupmessage.listGroupMessage
  );

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(GetAllGroupMessage(id));
      setLoading(false);
    };
    fetchData();
  }, [dispatch, id]);
  useEffect(() => {
    if (connection) {
      connection
        .invoke("JoinGroup", id + "")
        .catch((err) => console.error("Error joining group:", err));

      connection.on("UserJoin", (value) => {
        console.log(value);
      });
      connection.on("ReceiveGroupMessage",(id,groupMessage)=>{
        console.log(groupMessage)
        if(id!==userId.toString()){
          dispatch(addGroupMessageRecevie(groupMessage))
        }
      })
      
    }
    return () => {
      if(connection){
        connection.off("UserJoin");
        connection.off("ReceiveGroupMessage")
      }
    };
  }, [connection,id]);
  useEffect(() => {
    if (messagesEndRef.current && containerRef.current) {
      setTimeout(() => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 100); // Giảm delay để mượt hơn
    }
  }, [listGroupMessage]);
  const groupedMessages = groupMessagesByDate(listGroupMessage);

  return (
    <div className="flex flex-col p-4 space-y-3 bg-gray-100 h-screen overflow-y-auto" ref={containerRef}>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        Object.keys(groupedMessages).map((date, index) => (
          <div key={index}>
            {/* Hiển thị ngày */}
            <div className="flex justify-center my-2">
              <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full shadow-sm">
                {date}
              </div>
            </div>
            {groupedMessages[date].map((msg) => (
              <div
                key={msg.groupedMessageId}
                className={`flex items-end ${msg.senderId === userId ? "justify-end" : "justify-start"} mb-2`}
              >
                {/* Avatar cho tin nhắn người khác */}
                {msg.senderId !== userId && (
                  <img
                    src={msg.senderAvatar || "/default-avatar.png"}
                    alt="avatar"
                    className="w-10 h-10 rounded-full mr-2"
                  />
                )}
                {/* Nội dung tin nhắn */}
                <div
                  className={`max-w-xs md:max-w-md p-3 rounded-lg shadow border ${msg.senderId === userId ? "bg-blue-100 border-blue-300 text-black" : "bg-gray-200 border-gray-300 text-black"}`}
                >
                  {msg.senderId !== userId && (
                    <p className="text-xs font-bold text-gray-600">
                      {msg.senderName}
                    </p>
                  )}
                  {msg.content && <p className="text-sm">{msg.content}</p>}
                  {msg.files && msg.files.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {msg.files.map((file, index) => (
                        <FileMessage key={index} file={file} />
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-400 text-right">
                    {formatTime(msg.createAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
      {/* Cuộn xuống tin nhắn cuối cùng */}
      <div ref={messagesEndRef}></div>
    </div>
  );
};

export default GroupMessages;
