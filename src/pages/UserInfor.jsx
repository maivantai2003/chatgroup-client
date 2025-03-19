import { FaFile } from "react-icons/fa";
import MediaViewer from "../components/MediaView";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetAllUserMessageFile } from "../redux/usermessagefile/usermessagefileSlice";
import FileItem from "../components/FileItem";

const UserInfo = ({ conversation }) => {
  const [isOpenMedia, setIsOpenMedia] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listUserMessageFile = useSelector(
    (state) => state.usermessagefile.listUserMessageFile
  );
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(
        GetAllUserMessageFile({
          senderId: conversation.userId,
          receiverId: conversation.id,
        })
      );
      setLoading(false);
    };
    fetchData();
  }, [dispatch, conversation.id, conversation.userId]);
  const mediaItems = listUserMessageFile.filter((file) =>
    ["jpg", "jpeg", "png", "gif", "webp", "svg", "mp4", "mov", "avi"].includes(
      file.typeFile.toLowerCase()
    )
  );

  // Lọc danh sách file không phải ảnh/video
  const files = listUserMessageFile.filter(
    (file) =>
      ![
        "jpg",
        "jpeg",
        "png",
        "gif",
        "webp",
        "svg",
        "mp4",
        "mov",
        "avi",
      ].includes(file.typeFile.toLowerCase())
  );
  return (
    <div>
      <div className="font-bold text-center">Thông tin hội thoại</div>
      <div className="mt-4 flex flex-col items-center">
        <img
          src={conversation.avatar}
          className="w-16 h-16 rounded-full"
          alt="Avatar"
        />
        <div className="font-bold mt-2 flex items-center">
          {conversation.conversationName}
          {/* <i className="fas fa-pen ml-2 cursor-pointer text-gray-500"></i> */}
        </div>
      </div>
      <div className="flex justify-around mt-4">
        <button className="flex flex-col items-center">
          <i className="fas fa-bell text-lg"></i>
          <span className="text-xs">Tắt thông báo</span>
        </button>
        <button className="flex flex-col items-center">
          <i className="fas fa-thumbtack text-lg"></i>
          <span className="text-xs">Ghim hội thoại</span>
        </button>
        <button className="flex flex-col items-center">
          <i className="fas fa-users text-lg"></i>
          <span className="text-xs">Tạo nhóm</span>
        </button>
      </div>
      {/* <div className="mt-4">
        <div className="flex items-center p-2 border-b">
          <i className="fas fa-clock text-xl text-gray-600"></i>
          <span className="ml-2 text-sm">Danh sách nhắc hẹn</span>
        </div>
        <div className="flex items-center p-2">
          <i className="fas fa-users text-xl text-gray-600"></i>
          <span className="ml-2 text-sm">9 nhóm chung</span>
        </div>
      </div> */}
      <div className="h-[4px] bg-gray-200 my-4"></div>
      {/* Ảnh/Video */}
      <div className="mt-4">
        <div className="font-bold">Ảnh/Video</div>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {mediaItems.length > 0 ? (
            mediaItems.slice(0, 6).map((media, index) => {
              const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(
                media.fileUrl
              );
              const isVideo = /\.(mp4|mov|avi)$/i.test(media.fileUrl);

              return isImage ? (
                <img
                  key={index}
                  src={media.fileUrl}
                  className="w-20 h-20 rounded object-cover cursor-pointer"
                  alt="media"
                  onClick={() => {
                    setSelectedIndex(index);
                    setIsOpenMedia(true);
                  }}
                />
              ) : isVideo ? (
                <video
                  key={index}
                  className="w-20 h-20 rounded cursor-pointer"
                  onClick={() => {
                    setSelectedIndex(index);
                    setIsOpenMedia(true);
                  }}
                >
                  <source src={media.fileUrl} type="video/mp4" />
                  Trình duyệt không hỗ trợ video.
                </video>
              ) : null;
            })
          ) : (
            <p className="text-gray-500 text-sm">Chưa có ảnh hoặc video nào</p>
          )}
        </div>
        {mediaItems.length > 6 && (
          <button className="mt-2 text-blue-500">Xem tất cả</button>
        )}
      </div>
      <div className="h-[4px] bg-gray-200 my-4"></div>
      {/* File */}
      <div className="mt-4">
        <div className="font-bold">File</div>
        {/* <button
          onClick={() => setIsOpenMedia(true)}
          className="p-2 bg-blue-500 text-white rounded"
        >
          <FaFile /> File
        </button> */}
        <div className="mt-2">
          {files.length > 0 ? (
            files.map((file, index) => <FileItem key={index} file={file} />)
          ) : (
            <p className="text-gray-500 text-sm">Chưa có file nào</p>
          )}
        </div>
      </div>
      {isOpenMedia && (
        <MediaViewer
          onClose={() => setIsOpenMedia(false)}
          groupName={conversation.conversationName}
          mediaItems={mediaItems}
          selectedIndex={selectedIndex}
        />
      )}
    </div>
  );
};

export default UserInfo;
