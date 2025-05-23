import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetGroupById } from "../redux/group/groupSlice";
import { FaFile, FaSignOutAlt, FaUsers } from "react-icons/fa";
import AddMemberModal from "../components/AddMemberModal";
import { SignalRContext } from "../context/SignalRContext";
import MediaViewer from "../components/MediaView";
import {
  addMultipleGroupMessageFiles,
  GetAllGroupMessageFile,
} from "../redux/groupmessagefile/groupmessagefileSlice";
import FileItem from "../components/FileItem";

const GroupInfo = ({ conversation }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenMedia, setIsOpenMedia] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const groupDetail = useSelector((state) => state.group.group);
  const [showAllMedia, setShowAllMedia] = useState(false);
  const [showAllFiles, setShowAllFiles] = useState(false);
  const listGroupMessageFile = useSelector(
    (state) => state.groupmessagefile.listGroupMessageFile
  );
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const connection = useContext(SignalRContext);
  const prevId = useRef(null);
  useEffect(() => {
    if (!conversation?.id || prevId.current === conversation.id) return;
    const fectchData = async () => {
      if (conversation?.id) {
        setLoadingMembers(true);
        await dispatch(GetGroupById(conversation.id));
        setLoadingMembers(false);
      }
    };
    fectchData();
    prevId.current = conversation.id;
  }, [dispatch, conversation.id]);
  useEffect(() => {
    if (!conversation?.id) return;
    const fetchGroupFiles = async () => {
      setLoadingFiles(true);
      await dispatch(GetAllGroupMessageFile(conversation.id));
      setLoadingFiles(false);
    };

    fetchGroupFiles();
  }, [dispatch, conversation.id]);
  useEffect(() => {
    if (connection) {
      connection.on("MemberToGroup", () => {
        alert("GroupInfor");
        dispatch(GetGroupById(conversation.id));
      });
      connection.on(
        "ReceiveGroupMessageFileInfor",
        (groupId, userId, listFile) => {
          console.log("Call group");
          if (
            userId !== conversation.userId.toString() &&
            groupId === conversation.id.toString() &&
            conversation.type === "group"
          ) {
            console.log(userId);
            console.log(conversation.userId);
            dispatch(addMultipleGroupMessageFiles(listFile));
          }
        }
      );
      return () => {
        connection.off("MemberToGroup");
        connection.off("ReceiveGroupMessageFileInfor");
      };
    }
  }, [connection, dispatch]);
  const mediaItems = listGroupMessageFile.filter((file) =>
    ["jpg", "jpeg", "png", "gif", "webp", "svg", "mp4", "mov", "avi"].includes(
      file.typeFile.toLowerCase()
    )
  );
  const handleExitGroup = async () => {
    console.log(listGroupMessageFile)
  };
  // Lọc danh sách file không phải ảnh/video
  const files = listGroupMessageFile.filter(
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
    <div className="max-h-[calc(100vh-100px)] overflow-auto p-4 bg-white rounded-md shadow-md">
      <div className="font-bold text-center">Thông tin nhóm</div>
      <div className="mt-4 flex flex-col items-center">
        {/* <div className="flex -space-x-2">
          {conversation.avatars.map((avatar, index) => (
              <img
                key={index}
                src={avatar}
                className="w-10 h-10 rounded-full border border-white"
                alt="Avatar"
              />
            ))}
        </div> */}
        <img
          src={
            conversation.avatar !== null
              ? conversation.avatar
              : "https://res.cloudinary.com/dktn4yfpi/image/upload/v1740899136/bv3ndtwp1sosxw9sdvzj.jpg"
          }
          className="w-16 h-16 rounded-full"
          alt="Avatar"
        />
        <div className="font-bold mt-2 flex items-center">
          {conversation.conversationName}
          {/* <i className="fas fa-pen ml-2 cursor-pointer text-gray-500"></i> */}
        </div>
      </div>
      <div className="flex justify-around mt-4">
        {/* <button className="flex flex-col items-center">
          <i className="fas fa-bell text-lg"></i>
          <span className="text-xs">Tắt thông báo</span>
        </button>
        <button className="flex flex-col items-center">
          <i className="fas fa-thumbtack text-lg"></i>
          <span className="text-xs">Ghim hội thoại</span>
        </button> */}
        <button className="flex flex-col items-center">
          <i
            className="fas fa-user-plus text-lg"
            onClick={() => setIsOpen(true)}
          ></i>
          <span className="text-xs">Thêm thành viên</span>
        </button>
      </div>
      <div className="h-[4px] bg-gray-200 my-4"></div>
      <div className="mt-4">
        <div className="font-bold">Thành viên nhóm</div>
        {loadingMembers ? (
          <p className="text-gray-500 text-sm">
            Đang tải danh sách thành viên...
          </p>
        ) : (
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <FaUsers className="w-6 h-6" />
              <span>{groupDetail?.userNumber} thành viên</span>
            </div>
          </div>
        )}
      </div>
      <div className="h-[4px] bg-gray-200 my-4"></div>
      <div className="mt-4">
        <div className="font-bold">Ảnh/Video</div>
        <div className="grid grid-cols-3 gap-1 mt-2 max-h-96 overflow-auto">
          {mediaItems.length > 0 ? (
            <>
              {(showAllMedia ? mediaItems : mediaItems.slice(0, 6)).map(
                (media, index) => {
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
                }
              )}
              {mediaItems.length > 6 && (
                <button
                  onClick={() => setShowAllMedia(!showAllMedia)}
                  className="mt-2 text-blue-500"
                >
                  {showAllMedia ? "Thu gọn" : "Xem tất cả"}
                </button>
              )}
            </>
          ) : (
            <p className="text-gray-500 text-sm">Chưa có ảnh hoặc video nào</p>
          )}
        </div>
      </div>
      <div className="h-[4px] bg-gray-200 my-4"></div>
      <div className="mt-4">
        <div className="font-bold">File</div>
        {loadingFiles ? (
          <p className="text-gray-500 text-sm">Đang tải...</p>
        ) : (
          <div className="mt-2 max-h-96 overflow-auto">
            {files.length > 0 ? (
              <>
                {(showAllFiles ? files : files.slice(0, 3)).map(
                  (file, index) => (
                    <FileItem key={index} file={file} />
                  )
                )}
                {files.length > 3 && (
                  <button
                    onClick={() => setShowAllFiles(!showAllFiles)}
                    className="mt-2 text-blue-500"
                  >
                    {showAllFiles ? "Thu gọn" : "Xem tất cả"}
                  </button>
                )}
              </>
            ) : (
              <p className="text-gray-500 text-sm">Chưa có file nào</p>
            )}
          </div>
        )}
      </div>
      <div className="h-[4px] bg-gray-200 my-4"></div>
      <div className="mt-4">
        <button
          className="flex items-center text-red-500 hover:text-red-700 font-semibold"
          onClick={handleExitGroup}
        >
          <FaSignOutAlt className="w-5 h-5 mr-2" />
          Rời nhóm
        </button>
      </div>
      <AddMemberModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        userId={conversation.userId || null}
        groupId={conversation.id || null}
        groupName={conversation.conversationName || null}
        avatar={
          conversation?.avatar ||
          "https://res.cloudinary.com/dktn4yfpi/image/upload/v1740899136/bv3ndtwp1sosxw9sdvzj.jpg"
        }
        //onAddMembers={handleAddMembers}
        groupMembers={groupDetail?.groupDetailUsers || []}
      />
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

export default GroupInfo;
