import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetAllUserMessage } from "../redux/usermessage/usermessageSlice";
import { formatTime } from "../helpers/formatTime";
import { groupMessagesByDate } from "../helpers/groupMessageByDate"; // Sử dụng hàm nhóm tin nhắn theo ngày

const UserMessages = ({ userId, id, type, avatar }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
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

  // Nhóm tin nhắn theo ngày
  const groupedMessages = groupMessagesByDate(listUserMessage);

  return (
    <div className="flex flex-col space-y-3 p-4 bg-gray-100 min-h-screen overflow-y-auto">
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
                key={msg.id}
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
                  <p className="text-xs text-gray-500 text-right mt-1">
                    {formatTime(msg.createAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default UserMessages;
