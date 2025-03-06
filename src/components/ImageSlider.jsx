import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const images = [
//   "https://source.unsplash.com/random/300x200?sig=1",
//   "https://source.unsplash.com/random/300x200?sig=2",
//   "https://source.unsplash.com/random/300x200?sig=3",
//   "https://source.unsplash.com/random/300x200?sig=4",
];

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
      className="w-96 h-60 rounded-lg shadow-lg"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 1 }}
    />
  );
};

export default ImageSlider;
