import React, { useEffect, useRef, useState } from "react";
import {
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { GetAllFriendById, UpdateFriend } from "../redux/friend/friendSlice";
import UserInfoModal from "../components/UserInfoModal";
import { toast } from "react-toastify";

const FriendList = ({ id }) => {
  const [search, setSearch] = useState("");
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedFriendData, setSelectedFriendData] = useState(null);

  const dispatch = useDispatch();
  const friends = useSelector((state) => state.friend.listFriend);

  const menuRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(GetAllFriendById(id));
      setLoading(false);
    };
    fetchData();
  }, [dispatch, id]);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setSelectedFriend(null);
      }
    };
    if (selectedFriend) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedFriend]);

  const filteredFriends = friends.filter((friend) =>
    friend.userName.toLowerCase().includes(search.toLowerCase())
  );

  const handleRemoveFriend = async (id, userId, friendId) => {
    let friendDto = { userId: friendId, friendId: userId, status: 3 };
    try {
      if (friendDto && id) {
        const result = await dispatch(
          UpdateFriend({ id, friendDto })
        ).unwrap();
        if (!result) {
          toast.error("Hủy kết bạn không thành công");
          return;
        }
        toast.success("Hủy kết bạn thành công");
      }
    } catch (ex) {
      toast.error("Hủy kết bạn không thành công");
    }
  };

  return (
    <div className="max-w-4xl w-full mx-auto bg-white shadow-md rounded-xl p-5">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-3">
        <h2 className="text-xl font-bold text-gray-800">
          👥 Bạn bè ({friends.length})
        </h2>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="relative mt-4">
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Tìm bạn..."
          className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <XCircleIcon
            className="w-5 h-5 text-gray-400 absolute right-3 top-2.5 cursor-pointer hover:text-gray-600"
            onClick={() => setSearch("")}
          />
        )}
      </div>

      {/* Hiển thị loading */}
      {loading ? (
        <div className="flex justify-center items-center mt-6">
          <div className="w-8 h-8 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="mt-5 space-y-2">
          {filteredFriends.map((friend) => (
            <div
              key={friend.id}
              className="relative flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition"
            >
              {/* Avatar + Tên */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={friend.avatar}
                    alt={friend.userName}
                    className="w-11 h-11 rounded-full border"
                  />
                  {/* Dot online (có thể thay bằng trạng thái thật từ backend) */}
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <span className="text-gray-800 font-medium">{friend.userName}</span>
              </div>

              {/* Nút menu */}
              <button
                onClick={() =>
                  setSelectedFriend(
                    selectedFriend === friend.id ? null : friend.id
                  )
                }
              >
                <EllipsisVerticalIcon className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>

              {/* Menu */}
              {selectedFriend === friend.id && (
                <div
                  ref={menuRef}
                  className="absolute right-10 top-12 w-48 bg-white border shadow-lg rounded-md z-20 animate-fade-in"
                >
                  <ul>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSelectedFriend(null);
                        setSelectedFriendData(friend);
                        setShowModal(true);
                      }}
                    >
                      Xem thông tin
                    </li>
                    <li
                      className="px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        handleRemoveFriend(friend.id, friend.userId, friend.friendId);
                        setSelectedFriend(null);
                      }}
                    >
                      Xóa bạn
                    </li>
                  </ul>
                </div>
              )}

              {/* Modal thông tin */}
              {showModal && selectedFriendData && (
                <UserInfoModal
                  user={selectedFriendData}
                  onClose={() => setShowModal(false)}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(FriendList);
