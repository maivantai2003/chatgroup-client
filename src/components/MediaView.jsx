import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { X, Maximize, Minimize } from "lucide-react";

const mediaItems = [
  { id: 1, type: "image", src: "https://res.cloudinary.com/dktn4yfpi/image/upload/v1741507105/ygoiuqqyj4gqs4dutocn.png" },
  { id: 2, type: "video", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 3, type: "image", src: "https://res.cloudinary.com/dktn4yfpi/image/upload/v1740119533/lmqqpoakr4do1fdsgxse.jpg" },
];

export default function MediaViewer({ onClose, groupName }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(true);

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") handlePrev(); // Xử lý quay lại
      if (event.key === "ArrowRight" || event.key === "ArrowDown") handleNext(); // Xử lý tiếp theo
    };
  
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div
        className={`bg-gray-800 rounded-lg relative flex flex-col transition-all ${
          isFullScreen ? "w-[90vw] h-[90vh]" : "w-[60vw] h-[60vh]"
        }`}
      >
        {/* Tiêu đề */}
        <div className="text-center py-2 text-lg font-semibold border-b text-white relative">
          {groupName || ""}
          {/* Nút thu nhỏ/phóng to */}
          <button
            className="absolute top-2 right-12 text-white hover:text-gray-400"
            onClick={() => setIsFullScreen(!isFullScreen)}
          >
            {isFullScreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
          </button>
          {/* Nút đóng */}
          <button className="absolute top-2 right-2 text-white hover:text-gray-400" onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Nội dung */}
        <div className="flex flex-1">
          {/* Danh sách thumbnails */}
          <div className="w-1/4 bg-gray-900 p-4 overflow-y-auto">
            {mediaItems.map((item, index) => (
              <div
                key={item.id}
                className={`p-2 cursor-pointer border rounded transition ${
                  index === selectedIndex ? "border-blue-500 bg-gray-700" : "border-gray-600"
                }`}
                onClick={() => setSelectedIndex(index)}
              >
                {item.type === "image" ? (
                  <img src={item.src} alt="Thumbnail" className="w-full h-auto object-cover rounded" />
                ) : (
                  <video className="w-full h-auto object-cover rounded">
                    <source src={item.src} type="video/mp4" />
                  </video>
                )}
              </div>
            ))}
          </div>

          {/* Hiển thị nội dung chính */}
          <div className="w-3/4 flex items-center justify-center p-4 relative bg-black">
            {mediaItems[selectedIndex].type === "image" ? (
              <img
                src={mediaItems[selectedIndex].src}
                alt="Media"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            ) : (
              <video controls className="max-w-full max-h-full object-contain rounded-lg">
                <source src={mediaItems[selectedIndex].src} type="video/mp4" />
              </video>
            )}

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
