import { UserIcon, UserPlusIcon} from "@heroicons/react/24/outline";
import { useCallback, useState } from "react";
import FriendRequestModal from "../components/FriendRequestModal";
import CreateGroupModal from "../components/CreateGroupModal";
import { useDispatch, useSelector } from "react-redux";
import EditProfileModal from "../components/EditProfileModal";
import { GetUser } from "../redux/user/userSlice";
import { FaLayerGroup, FaUsers } from "react-icons/fa";
const TitleBar = ({ name,id,avatar }) => {
  const dispatch = useDispatch();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isGroupModalOpen, setGroupModalOpen] = useState(false);
  const [isEditProfileOpen, setEditProfileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const user=useSelector((state)=>state.user.user)
  const handleEditProfile = useCallback(async () => {
    if (!user || user.id !== id) {
      setIsLoading(true);
      await dispatch(GetUser(id));
      setIsLoading(false);
    }
    setEditProfileOpen(true);
  }, [dispatch, user, id]);
  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-md">
      {/* Avatar + Tên */}
      <div className="flex items-center space-x-3">
        <img
          alt="User avatar"
          className="rounded-full"
          height="40"
          src={avatar?avatar:"https://storage.googleapis.com/a1aa/image/hpZhmsnlmmhMuDK-hctvwQqwNT_PXKlCqSxqX3YEwmo.jpg"}
          width="40"
          onClick={handleEditProfile}
        />
        <span className="text-gray-900 font-medium">{name}</span>
      </div>

      {/* Các nút thao tác */}
      <div className="flex space-x-2">
        {/* Nút Thêm Bạn */}
        <button className="p-2 hover:bg-gray-200 transition" onClick={()=>{
          setModalOpen(true)
        }}>
          <UserPlusIcon className="w-5 h-5 text-gray-700" />
        </button>

        {/* Nút Thêm Vào Nhóm */}
        <button className="p-2 hover:bg-gray-200 transition" onClick={() => setGroupModalOpen(true)}>
          <FaUsers className="w-5 h-5 text-gray-700" />
        </button>
      </div>
      <FriendRequestModal isOpen={isModalOpen} id={id} closeModal={() => setModalOpen(false)} />
      <CreateGroupModal isOpen={isGroupModalOpen} id={id} closeModal={() => setGroupModalOpen(false)} />
      {isLoading && <p className="text-gray-500 text-sm">Đang tải...</p>}
      {isEditProfileOpen && user && (
        <EditProfileModal isOpen={isEditProfileOpen} closeModal={() => setEditProfileOpen(false)} user={user} />
      )}
    </div>
  );
};

export default TitleBar;
