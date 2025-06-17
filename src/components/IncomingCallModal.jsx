// components/IncomingCallModal.jsx

const IncomingCallModal = ({ callerName, onAccept, onReject }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-lg p-6 shadow-lg text-center">
        <h2 className="text-xl font-semibold mb-4">{callerName} đang gọi cho bạn</h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={onAccept}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Chấp nhận
          </button>
          <button
            onClick={onReject}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Từ chối
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
