import { useContext, useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addFilesToUserMessage,
  GetAllUserMessage,
  receiveUserMessage,
} from "../redux/usermessage/usermessageSlice";
import { formatTime } from "../helpers/formatTime";
import { groupMessagesByDate } from "../helpers/groupMessageByDate";
import { SignalRContext } from "../context/SignalRContext";
import FileMessage from "./FileMessage";

const SCROLL_THRESHOLD = 100; // khoảng cách px để coi là "đang ở cuối"

const UserMessages = ({ userId, id, type, avatar }) => {
  const dispatch = useDispatch();
  const connection = useContext(SignalRContext);

  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showNewMessageBtn, setShowNewMessageBtn] = useState(false);

  const pageSize = 10;
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const notificationSound = new Audio("/sound/notification.mp3");

  const listUserMessage = useSelector(
    (state) => state.usermessage.listUserMessage
  );

  // 🔹 Lấy dữ liệu lần đầu
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(
        GetAllUserMessage({
          senderId: userId,
          receiverId: id,
          lastMessage: null,
          pageSize,
        })
      );
      setLoading(false);
    };
    fetchData();
  }, [dispatch, userId, id, type]);

  // 🔹 Nhận message từ SignalR
  useEffect(() => {
    if (!connection) return;

    const handleReceiveMessage = (userMessage) => {
      dispatch(receiveUserMessage(userMessage));
      notificationSound.play().catch(() => {});

      // nếu user đang ở cuối thì auto scroll
      if (isAtBottom()) {
        scrollToBottom();
        setShowNewMessageBtn(false);
      } else {
        setShowNewMessageBtn(true);
      }
    };

    const handleReceiveFile = (file) => {
      dispatch(addFilesToUserMessage(file));
    };

    connection.on("ReceiveUserMessage", handleReceiveMessage);
    connection.on("ReceiveUserMessageFile", handleReceiveFile);

    return () => {
      connection.off("ReceiveUserMessage", handleReceiveMessage);
      connection.off("ReceiveUserMessageFile", handleReceiveFile);
    };
  }, [connection, dispatch]);

  // 🔹 Hàm check user có đang ở cuối không
  const isAtBottom = useCallback(() => {
    if (!containerRef.current) return false;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    return scrollHeight - scrollTop - clientHeight < SCROLL_THRESHOLD;
  }, []);

  // 🔹 Scroll xuống cuối
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      //messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, []);

  // 🔹 Lần đầu load thì scroll xuống cuối
  useEffect(() => {
    if (!loading) {
      scrollToBottom();
    }
  }, [loading, scrollToBottom]);

  // 🔹 Hàm xử lý scroll (load thêm tin nhắn cũ)
  const handleScroll = useCallback(async () => {
  if (!containerRef.current || loadingMore || !hasMore) return;

  if (containerRef.current.scrollTop <= 10 && !loadingMore && hasMore) {
    setLoadingMore(true);
    const prevHeight = containerRef.current.scrollHeight;

    // 🔹 Lấy tin nhắn cũ nhất (đầu danh sách)
    const oldestMsg = listUserMessage[listUserMessage.length - 1];
    const lastMessageDate = oldestMsg?.createAt;

    const result = await dispatch(
      GetAllUserMessage({
        senderId: userId,
        receiverId: id,
        lastMessage: lastMessageDate,
        pageSize,
      })
    );
    console.log(listUserMessage);
    if (result.payload.length < pageSize) setHasMore(false);
    setLoadingMore(false);

    // 🔹 Giữ nguyên vị trí cuộn (tránh bị nhảy)
    const newHeight = containerRef.current.scrollHeight;
    containerRef.current.scrollTop = newHeight - prevHeight;
  }

  // nếu user kéo xuống cuối → ẩn nút "tin nhắn mới"
  if (isAtBottom()) {
    setShowNewMessageBtn(false);
  }
}, [dispatch, userId, id, listUserMessage, loadingMore, hasMore, isAtBottom]);

  // 🔹 Gắn listener scroll
  useEffect(() => {
    const div = containerRef.current;
    if (!div) return;
    div.addEventListener("scroll", handleScroll);
    return () => div.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // 🔹 Lọc tin nhắn 2 chiều
  const filteredMessages = listUserMessage.filter(
    (msg) =>
      (msg.senderId === userId && msg.receiverId === id) ||
      (msg.senderId === id && msg.receiverId === userId)
  );

  const groupedMessages = groupMessagesByDate(filteredMessages);

  return (
    <div className="relative flex flex-col space-y-3 p-4  bg-gray-100 h-full overflow-y-auto" ref={containerRef}>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {loadingMore && (
            <div className="flex justify-center my-2 text-gray-500 text-sm">
              Đang tải thêm tin nhắn...
            </div>
          )}

          {Object.keys(groupedMessages).map((date, index) => (
            <div key={index}>
              {/* Hiển thị ngày */}
              <div className="flex justify-center my-2">
                <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full shadow-sm">
                  {date}
                </div>
              </div>

              {/* Hiển thị tin nhắn */}
              {groupedMessages[date].map((msg) => (
                <div key={msg.userMessageId} className="flex flex-col mb-3">
                  {/* Nếu có text */}
                  {msg.content && (
                    <div
                      className={`flex items-end space-x-2 ${
                        msg.senderId === userId
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {msg.senderId !== userId && (
                        <img
                          src={avatar || "/default-avatar.png"}
                          alt="Avatar"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      <div
                        className={`p-3 max-w-xs md:max-w-md rounded-lg border shadow-sm ${
                          msg.senderId === userId
                            ? "bg-blue-100 border-blue-300 text-black"
                            : "bg-gray-100 border-gray-300 text-black"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs text-gray-500 text-right mt-1">
                          {formatTime(msg.createAt)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Nếu có file */}
                  {msg.files &&
                    msg.files.length > 0 &&
                    msg.files.map((file, index) => (
                      <div
                        key={file.fileId}
                        className={`flex items-end space-x-2 mt-2 ${
                          msg.senderId === userId
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        {msg.senderId !== userId && (
                          <img
                            src={avatar || "/default-avatar.png"}
                            alt="Avatar"
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                        <div
                          className={`p-3 max-w-xs md:max-w-md rounded-lg border shadow-sm ${
                            msg.senderId === userId
                              ? "bg-blue-100 border-blue-300 text-black"
                              : "bg-gray-100 border-gray-300 text-black"
                          }`}
                        >
                          <FileMessage file={file} />
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          ))}
        </>
      )}

      {/* Cuộn xuống cuối */}
      <div ref={messagesEndRef}></div>

      {/* 🔹 Nút "Tin nhắn mới" */}
      {showNewMessageBtn && (
        <button
          onClick={() => {
            scrollToBottom();
            setShowNewMessageBtn(false);
          }}
          className="absolute bottom-16 right-4 bg-blue-500 text-white px-3 py-2 rounded-full shadow-lg text-sm"
        >
          Tin nhắn mới ▼
        </button>
      )}
    </div>
  );
};

export default UserMessages;
