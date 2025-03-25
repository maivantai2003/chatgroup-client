import { FiUsers } from "react-icons/fi";
import { useSelector } from "react-redux";
const TimeRequest = ({ name, type,id }) => {
  const groupDetail = useSelector((state) => state.group.group);
  return (
    <div className="ml-2">
      <div className="font-bold">{name}</div>
      {type === "user" ? (
        <div className="text-sm text-gray-600">Truy cập 1 giờ trước</div>
      ) : type === "group" ? (
        <div className="text-sm text-gray-600 flex items-center gap-1">
          <FiUsers className="text-gray-600 text-lg" />
          {groupDetail?.groupId === id && groupDetail?.userNumber ? groupDetail.userNumber : ""} thành viên
        </div>
      ) : (
        <div className="text-sm text-gray-600">Lưu trữ dữ liệu</div>
      )}
    </div>
  );
};
export default TimeRequest;
