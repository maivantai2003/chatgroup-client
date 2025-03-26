import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import slide1 from "../assets/images/slide_1.jpg";
import slide2 from "../assets/images/slide_2.jpg";
import slide3 from "../assets/images/slide_3.jfif";
const images = [slide1, slide2, slide3];

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
      className="w-[600px] h-[400px] max-w-full rounded-lg shadow-2xl"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 1 }}
    />
  );
};

const ChatPlaceholder = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-8 bg-gray-100">
      <ImageSlider />
      <p className="text-2xl text-gray-600 font-semibold">
        Chọn một cuộc trò chuyện để bắt đầu
      </p>
    </div>
  );
};

export default ChatPlaceholder;
