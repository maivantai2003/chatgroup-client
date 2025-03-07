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
  }, [dispatch, userId,type]);
  const filteredCloudMessages = listCloudMessage.filter((conv) => conv.userId === userId);
  const groupedMessages = groupMessagesByDate(filteredCloudMessages);
  return (
    <div className="flex flex-col space-y-2 p-4">
    {filteredCloudMessages.map((msg, index) => (
      <div key={index} className={`flex ${index === 0 ? "justify-start" : "justify-end"}`}>
        <div className="bg-blue-100 border border-blue-300 rounded-lg p-2 max-w-xs">
          <p className="text-gray-900">{msg.content}</p>
          <p className="text-xs text-gray-500 text-left">{formatTime(msg.createAt)}</p>
        </div>
      </div>
    ))}
  </div>
  );
};

export default CloudMessages;
