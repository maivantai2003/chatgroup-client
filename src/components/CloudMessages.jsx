import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetCloudMessagesById } from "../redux/cloudmessage/cloudmessageSlice";
import { formatTime } from "../helpers/formatTime";
import { groupMessagesByDate } from "../helpers/groupMessageByDate";

const CloudMessages = ({ userId, type }) => {
  const listCloudMessage = useSelector(
    (state) => state.cloudmessage.listCloudMessage
  );
  const dispatch = useDispatch();
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
  return (
    <div className="flex flex-col space-y-2 p-4">
      {Object.keys(groupedMessages).map((date, index) => (
        <div key={index+1}>
          {/* Hiển thị ngày */}
          <div className="text-center text-gray-500 text-sm my-2">{date}</div>

          {/* Hiển thị tin nhắn trong ngày đó */}
          {groupedMessages[date].map((msg, msgIndex) => (
            <div
              key={msg.cloudMessageId}
              // className={`flex ${
              //   msgIndex === 0 ? "justify-start" : "justify-end"
              // }`}
              className="flex justify-end"
            >
              <div className="bg-blue-100 border border-blue-300 rounded-lg p-2 max-w-xs">
                <p className="text-gray-900">{msg.content}</p>
                <p className="text-xs text-gray-500 text-left">
                  {formatTime(msg.createAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CloudMessages;
