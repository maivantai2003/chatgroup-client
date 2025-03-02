// const TitleBar=({name})=>{
//     return <div className="flex items-center p-4">
//     <img
//       alt="User avatar"
//       className="rounded-full"
//       height="40"
//       src="https://storage.googleapis.com/a1aa/image/hpZhmsnlmmhMuDK-hctvwQqwNT_PXKlCqSxqX3YEwmo.jpg"
//       width="40"
//     />
//     <span className="ml-2">{name}</span>
//   </div>
// }
// export default TitleBar;
import { UserIcon, UserPlusIcon} from "@heroicons/react/24/outline";
import { useState } from "react";
import FriendRequestModal from "../components/FriendRequestModal";
import CreateGroupModal from "../components/CreateGroupModal";
const TitleBar = ({ name,id }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isGroupModalOpen, setGroupModalOpen] = useState(false);
  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-md">
      {/* Avatar + Tên */}
      <div className="flex items-center space-x-3">
        <img
          alt="User avatar"
          className="rounded-full"
          height="40"
          src="https://storage.googleapis.com/a1aa/image/hpZhmsnlmmhMuDK-hctvwQqwNT_PXKlCqSxqX3YEwmo.jpg"
          width="40"
        />
        <span className="text-gray-900 font-medium">{name}</span>
      </div>

      {/* Các nút thao tác */}
      <div className="flex space-x-2">
        {/* Nút Thêm Bạn */}
        <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-200 transition" onClick={()=>{
          setModalOpen(true)
        }}>
          <UserPlusIcon className="w-5 h-5 text-gray-700" />
        </button>

        {/* Nút Thêm Vào Nhóm */}
        <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-200 transition" onClick={() => setGroupModalOpen(true)}>
          <UserIcon className="w-5 h-5 text-gray-700" />
        </button>
      </div>
      <FriendRequestModal isOpen={isModalOpen} closeModal={() => setModalOpen(false)} />
      <CreateGroupModal isOpen={isGroupModalOpen} id={id} closeModal={() => setGroupModalOpen(false)} />
    </div>
  );
};

export default TitleBar;
