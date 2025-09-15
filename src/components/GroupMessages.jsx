import { useContext, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addFilesToGroupMessage,
  addGroupMessageRecevie,
  GetAllGroupMessage,
} from "../redux/groupmessage/groupmessageSlice";
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
        .invoke("LeaveGroup", id + "")
        .catch((err) => console.error("Error leaving group:", err))
        .finally(() => {
          connection
            .invoke("JoinGroup", id + "")
            .catch((err) => console.error("Error joining group:", err));
        });

      connection.on("UserJoin", (value) => {
        console.log(value);
      });
      connection.on("ReceiveGroupMessageFile", (senderId, file) => {
        if (senderId !== userId.toString()) {
          dispatch(addFilesToGroupMessage(file));
        }
      });
      connection.on("ReceiveGroupMessage", (senderId, groupMessage) => {
        if (senderId !== userId.toString()) {
          dispatch(addGroupMessageRecevie(groupMessage));
        }
      });
    }
    return () => {
      if (connection) {
        connection.off("UserJoin");
        connection.off("ReceiveGroupMessage");
        connection.off("ReceiveGroupMessageFile");
      }
    };
  }, [connection, id]);

  useEffect(() => {
    if (messagesEndRef.current && containerRef.current) {
      setTimeout(() => {
        messagesEndRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 100);
    }
  }, [listGroupMessage]);

  const filteredMessages = listGroupMessage.filter((msg) => msg.groupId === id);
  const groupedMessages = groupMessagesByDate(filteredMessages);

  return (
    <div
      className="flex flex-col p-4 space-y-3 bg-gray-100 flex-grow overflow-y-auto"
      ref={containerRef}
    >
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

            {/* Hiển thị tin nhắn trong ngày */}
            {groupedMessages[date].map((msg) => (
              <div key={msg.groupedMessageId} className="flex flex-col mb-3">
                {/* Nếu có text */}
                {msg.content && (
                  <div
                    className={`flex items-end space-x-2 ${
                      msg.senderId === userId ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.senderId !== userId && (
                      <img
                        src={msg.senderAvatar || "/default-avatar.png"}
                        alt="avatar"
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <div
                      className={`max-w-xs md:max-w-md p-3 rounded-lg shadow border ${
                        msg.senderId === userId
                          ? "bg-blue-100 border-blue-300 text-black"
                          : "bg-white border-gray-300 text-black"
                      }`}
                    >
                      {msg.senderId !== userId && (
                        <p className="text-xs font-bold text-gray-600 mb-1">
                          {msg.senderName}
                        </p>
                      )}
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs text-gray-400 text-right mt-1">
                        {formatTime(msg.createAt)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Nếu có file, mỗi file là 1 bubble riêng */}
                {msg.files &&
                  msg.files.length > 0 &&
                  msg.files.map((file, index) => (
                    <div
                      key={index}
                      className={`flex items-end space-x-2 mt-2 ${
                        msg.senderId === userId ? "justify-end" : "justify-start"
                      }`
                    }
                    >
                      {msg.senderId !== userId && (
                        <img
                          src={msg.senderAvatar || "/default-avatar.png"}
                          alt="avatar"
                          className="w-10 h-10 rounded-full"
                        />
                      )}
                      <div
                        className={`max-w-xs md:max-w-md p-3 rounded-lg shadow border ${
                          msg.senderId === userId
                            ? "bg-blue-100 border-blue-300 text-black"
                            : "bg-white border-gray-300 text-black"
                        }`}
                      >
                        {msg.senderId !== userId && (
                          <p className="text-xs font-bold text-gray-600 mb-1">
                            {/* {msg.senderName} */}
                          </p>
                        )}
                        <FileMessage file={file} />
                        {/* <p className="text-xs text-gray-400 text-right mt-1">
                          {formatTime(msg.createAt)}
                        </p> */}
                      </div>
                    </div>
                  ))}
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
