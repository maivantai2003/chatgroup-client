import { Phone, Video } from "lucide-react";

const CallButton = ({ onVoiceCall, onVideoCall }) => {
  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={onVoiceCall}
        className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
      >
        <Phone size={18} />
      </button>
      <button
        onClick={onVideoCall}
        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
      >
        <Video size={18} />
      </button>
    </div>
  );
};

export default CallButton;
