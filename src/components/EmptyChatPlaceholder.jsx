import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

const EmptyChatPlaceholder = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop={true}
        className="w-3/4"
      >
        <SwiperSlide>
          <div className="flex flex-col items-center">
            <img
              src="/images/empty-1.png"
              alt="Empty chat"
              className="w-40 h-40"
            />
            <p className="text-gray-500 text-center mt-2">Chào bạn! Hãy bắt đầu cuộc trò chuyện nào!</p>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="flex flex-col items-center">
            <img
              src="/images/empty-2.png"
              alt="Chat feature"
              className="w-40 h-40"
            />
            <p className="text-gray-500 text-center mt-2">Nhắn tin nhanh chóng, tiện lợi!</p>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="flex flex-col items-center">
            <img
              src="/images/empty-3.png"
              alt="Group chat"
              className="w-40 h-40"
            />
            <p className="text-gray-500 text-center mt-2">Kết nối bạn bè, tạo nhóm dễ dàng!</p>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default EmptyChatPlaceholder;
