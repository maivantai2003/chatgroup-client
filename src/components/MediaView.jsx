import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { X, Maximize, Minimize } from "lucide-react";

export default function MediaViewer({
  onClose,
  groupName,
  mediaItems,
  selectedIndex,
}) {
  const [currentIndex, setCurrentIndex] = useState(selectedIndex);
  const [isFullScreen, setIsFullScreen] = useState(true);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + mediaItems.length) % mediaItems.length
    );
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") handlePrev();
      if (event.key === "ArrowRight" || event.key === "ArrowDown") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Dialog
      open={true}
      onClose={onClose}
      className="fixed inset-0 flex items-center justify-center bg-black/50"
    >
      <div
        className={`bg-gray-800 rounded-lg flex flex-col transition-all overflow-hidden ${
          isFullScreen ? "w-[90vw] h-[90vh]" : "w-[60vw] h-[60vh]"
        }`}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* Tiêu đề */}
        <div className="text-center py-2 text-lg font-semibold border-b text-white relative">
          {groupName || ""}
          {/* Nút thu nhỏ/phóng to */}
          <button
            className="absolute top-2 right-12 text-white hover:text-gray-400"
            onClick={() => setIsFullScreen(!isFullScreen)}
          >
            {isFullScreen ? (
              <Minimize className="w-6 h-6" />
            ) : (
              <Maximize className="w-6 h-6" />
            )}
          </button>
          {/* Nút đóng */}
          <button
            className="absolute top-2 right-2 text-white hover:text-gray-400"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Nội dung */}
        <div className="flex flex-1 overflow-hidden">
          {/* Danh sách thumbnails */}
          <div className="w-1/4 bg-gray-900 p-4 overflow-y-auto">
            {mediaItems.map((item, index) => (
              <div
                key={index}
                className={`p-2 cursor-pointer border rounded transition ${
                  index === currentIndex
                    ? "border-blue-500 bg-gray-700"
                    : "border-gray-600"
                }`}
                onClick={() => setCurrentIndex(index)}
              >
                {item.typeFile
                  .toLowerCase()
                  .match(/(jpg|jpeg|png|gif|webp|svg)/) ? (
                  <img
                    src={item.fileUrl}
                    alt="Thumbnail"
                    className="w-full h-24 object-cover rounded"
                  />
                ) : (
                  <video className="w-full h-24 object-cover rounded">
                    <source src={item.fileUrl} type="video/mp4" />
                  </video>
                )}
              </div>
            ))}
          </div>

          {/* Hiển thị nội dung chính */}
          <div className="w-3/4 flex items-center justify-center p-4 relative bg-black">
            <div className="w-full h-full flex items-center justify-center">
              {mediaItems[currentIndex].typeFile
                .toLowerCase()
                .match(/(jpg|jpeg|png|gif|webp|svg)/) ? (
                <img
                  src={mediaItems[currentIndex].fileUrl}
                  alt="Media"
                  className="w-full h-full max-w-full max-h-full object-contain"
                />
              ) : (
                <video
                  controls
                  
                  className="w-full h-full max-w-full max-h-full object-contain"
                >
                  <source
                    src={mediaItems[currentIndex].fileUrl}
                    type="video/mp4"
                  />
                </video>
              )}
            </div>

            {/* Nút điều hướng */}
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-500"
            >
              &#8678;
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-500"
            >
              &#8680;
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
