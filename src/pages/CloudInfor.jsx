import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetAllCloudMessageFiles } from "../redux/cloudmessagefile/cloudmessagefileSlice";
import FileItem from "../components/FileItem";
import MediaViewer from "../components/MediaView";

const CloudInfo = ({ conversation }) => {
  const [loading,setLoading]=useState(false)
  const dispatch=useDispatch()
  const [isOpenMedia, setIsOpenMedia] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listCloudMessageFile=useSelector((state)=>state.cloudmessagefile.listCloudMessageFiles)
  useEffect(()=>{
    const fetchData=async()=>{
      setLoading(true)
      await dispatch(GetAllCloudMessageFiles(conversation.userId))
      setLoading(false)
    }
    fetchData()
  },[dispatch,conversation.id])
  const mediaItems = listCloudMessageFile.filter((file) =>
    ["jpg", "jpeg", "png", "gif", "webp", "svg", "mp4", "mov", "avi"].includes(
      file.typeFile.toLowerCase()
    )
  );
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="loader"></div>
        <p className="ml-2 text-gray-500">Đang tải dữ liệu...</p>
      </div>
    );
  }
  // Lọc danh sách file không phải ảnh/video
  const files = listCloudMessageFile.filter(
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
            {conversation.userName}
            {/* <i className="fas fa-pen ml-2 cursor-pointer text-gray-500"></i> */}
          </div>
        </div>
        <div className="flex justify-around mt-4">
          <button className="flex flex-col items-center">
            <i className="fas fa-thumbtack text-lg"></i>
            <span className="text-xs">Ghim hội thoại</span>
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
  
        {/* Ảnh/Video */}
        <div className="h-[4px] bg-gray-200 my-4"></div>
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
        )}        </div>
        <div className="h-[4px] bg-gray-200 my-4"></div>
        {/* File */}
        <div className="mt-4">
          <div className="font-bold">File</div>
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
  
  export default CloudInfo;
  