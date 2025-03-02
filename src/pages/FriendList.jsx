import { useEffect, useState } from "react";
import {
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { GetAllFriendById } from "../redux/friend/friendSlice";
import UserInfoModal from "../components/UserInfoModal";

const FriendList = ({ id }) => {
  const [search, setSearch] = useState("");
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(true);
  const dispatch = useDispatch();
  const friends = useSelector((state) => state.friend.listFriend);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(GetAllFriendById(id));
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);
  const filteredFriends = friends.filter((friend) =>
    friend.userName.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-4">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-3">
        <h2 className="text-lg font-semibold">Bạn bè ({friends.length})</h2>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="relative mt-3">
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Tìm bạn"
          className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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
        <div className="flex justify-center items-center mt-4">
          <div className="w-8 h-8 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="mt-4">
          {filteredFriends.map((friend) => (
            <div
              key={friend.id}
              className="relative flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={friend.avatar}
                  alt={friend.userName}
                  className="w-10 h-10 rounded-full"
                />
                <span className="text-gray-800">{friend.userName}</span>
              </div>
              <button
                onClick={() =>
                  setSelectedFriend(
                    friend.id === selectedFriend ? null : friend.id
                  )
                }
              >
                <EllipsisVerticalIcon className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>
              {selectedFriend === friend.id && (
                <div className="absolute right-10 mt-2 w-48 bg-white border shadow-lg rounded-md">
                  <ul>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSelectedFriend(null);
                        setShowModal(true);
                      }}
                    >
                      Xem thông tin
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      Phân loại
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      Đặt tên gợi nhớ
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      Chặn người này
                    </li>
                    <li className="px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer">
                      Xóa bạn
                    </li>
                  </ul>
                  {showModal && (
                    <UserInfoModal
                      user={friend}
                      onClose={() => setShowModal(false)}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendList;
