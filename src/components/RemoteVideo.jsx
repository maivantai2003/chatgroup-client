import React from "react";

const RemoteVideo = () => {
  return (
    <div className="fixed top-4 right-4 bg-black bg-opacity-60 rounded-lg p-2 z-50">
      <video
        id="remoteVideo"
        autoPlay
        className="w-64 h-48 rounded-lg shadow border border-white"
      />
    </div>
  );
};

export default RemoteVideo;