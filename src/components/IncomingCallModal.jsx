const IncomingCallModal = ({ callerName, onAccept, onReject }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-80 text-center">
        <h3 className="text-lg font-semibold">📲 Cuộc gọi đến</h3>
        <p className="text-gray-600 mt-2">{callerName} đang gọi cho bạn...</p>
        <div className="flex justify-center gap-6 mt-4">
          <button
            onClick={onReject}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            ❌ Từ chối
          </button>
          <button
            onClick={onAccept}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            ✅ Trả lời
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
