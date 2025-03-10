import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetGroupById } from "../redux/group/groupSlice";
import { FaSignOutAlt, FaUsers } from "react-icons/fa";
import AddMemberModal from "../components/AddMemberModal";
import { useSignalR } from "../context/SignalRContext";

const GroupInfo = ({ conversation }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const groupDetail = useSelector((state) => state.group.group);
  const [loading, setLoading] = useState(false);
  const prevId = useRef(null);
  const connection=useSignalR()
  useEffect(() => {
    if (!conversation?.id || prevId.current === conversation.id) return;
    const fectchData = async () => {
      if (conversation?.id) {
        setLoading(true);
        await dispatch(GetGroupById(conversation.id));
        setLoading(false);
      }
    };
    fectchData();
    prevId.current = conversation.id;
  }, [dispatch, conversation.id,conversation.userId]);
  useEffect(()=>{
    if (connection) {
          connection.on("MemberToGroup", () => {
            console.log("New message received in conversation");
            dispatch(GetGroupById(conversation.id));
          });
          return () => {
            connection.off("MemberToGroup");
          };
        }
  },[connection,dispatch, conversation.id,conversation.userId])
  if (loading) {
    return <div className="text-center font-bold">Đang tải dữ liệu...</div>;
  }
  return (
    <div>
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
        <button className="flex flex-col items-center">
          <i className="fas fa-bell text-lg"></i>
          <span className="text-xs">Tắt thông báo</span>
        </button>
        <button className="flex flex-col items-center">
          <i className="fas fa-thumbtack text-lg"></i>
          <span className="text-xs">Ghim hội thoại</span>
        </button>
        <button className="flex flex-col items-center">
          <i className="fas fa-user-plus text-lg" onClick={()=>setIsOpen(true)}></i>
          <span className="text-xs">Thêm thành viên</span>
        </button>
      </div>
      <div className="h-[4px] bg-gray-200 my-4"></div>
      <div className="mt-4">
        <div className="font-bold">Thành viên nhóm</div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <FaUsers className="w-6 h-6" />
            <span>{groupDetail?.userNumber} thành viên</span>
          </div>
        </div>
      </div>
      <div className="h-[4px] bg-gray-200 my-4"></div>
      <div className="mt-4">
        <div className="font-bold">Ảnh/Video</div>
        <div className="grid grid-cols-3 gap-1 mt-2">
          {/* {conversation.media.map((item, index) => (
            <img
              key={index}
              src={item}
              className="w-20 h-20 object-cover rounded"
              alt="Media"
            />
          ))} */}
        </div>
        <button className="mt-2 text-blue-500">Xem tất cả</button>
      </div>
      <div className="h-[4px] bg-gray-200 my-4"></div>
      <div className="mt-4">
        <div className="font-bold">File</div>
        {/* {conversation.files.map((file, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 bg-gray-100 rounded mt-2"
          >
            <div className="flex items-center">
              <i className={`fas fa-file-${file.type} text-blue-500`}></i>
              <div className="ml-2">
                <div className="text-sm">{file.name}</div>
                <div className="text-xs text-gray-600">
                  {file.size} KB · {file.date}
                </div>
              </div>
            </div>
            <i className="fas fa-check-circle text-green-500"></i>
          </div>
        ))} */}
        <button className="mt-2 text-blue-500">Xem tất cả</button>
      </div>
      <div className="h-[4px] bg-gray-200 my-4"></div>
      <div className="mt-4">
      <button className="flex items-center text-red-500 hover:text-red-700 font-semibold">
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
        avatar={conversation?.avatar || "https://res.cloudinary.com/dktn4yfpi/image/upload/v1740899136/bv3ndtwp1sosxw9sdvzj.jpg"}
        //onAddMembers={handleAddMembers}
        groupMembers={groupDetail?.groupDetailUsers || []}
      />
    </div>
  );
};

export default GroupInfo;
