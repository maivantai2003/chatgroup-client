import { FiUsers } from "react-icons/fi";
const TimeRequest = ({ name, type }) => {
  return (
    <div className="ml-2">
      <div className="font-bold">{name}</div>
      {type === "user" ? (
        <div className="text-sm text-gray-600">Truy cập 1 giờ trước</div>
      ) : type === "group" ? (
        <FiUsers className="text-gray-600 text-lg" />
      ) : (
        <div className="text-sm text-gray-600">Lưu trữ dữ liệu</div>
      )}
    </div>
  );
};
export default TimeRequest;
