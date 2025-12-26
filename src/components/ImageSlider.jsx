import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import slide2 from "../assets/images/slide_2.jpg";
import slide3 from "../assets/images/slide_3.jfif";
const images = [slide2, slide3];

const ImageSlider = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.img
  key={currentImage}
  src={images[currentImage]}
  className="w-[90%] h-[85%] object-contain rounded-2xl shadow-2xl"
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.9 }}
  transition={{ duration: 1 }}
/>
  );
};

const ChatPlaceholder = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-100">
  <ImageSlider />
  <p className="text-2xl text-gray-600 font-semibold mt-8">
    Chọn một cuộc trò chuyện để bắt đầu
  </p>
</div>

  );
};

export default ChatPlaceholder;
