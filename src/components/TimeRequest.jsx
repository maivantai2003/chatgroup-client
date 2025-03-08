const TimeRequest = ({name}) => {
  return (
    <div className="ml-2">
      <div className="font-bold">{name}</div>
      <div className="text-sm text-gray-600">Truy cập 1 giờ trước</div>
    </div>
  );
};
export default TimeRequest;
