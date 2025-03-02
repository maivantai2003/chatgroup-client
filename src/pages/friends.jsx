import { useEffect, useState } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { GetFriendRequest, UpdateFriend } from "../redux/friend/friendSlice";
import { GetAllUser } from "../redux/user/userSlice";

// const friendRequests = [
//   { name: "Nguyễn Văn A", image: "https://via.placeholder.com/50" },
//   { name: "Trần Thị B", image: "https://via.placeholder.com/50" },
// ];

// const friends = [
//   {
//     name: "Mai Trung Chính",
//     groups: 3,
//     image: "https://via.placeholder.com/50",
//   },
//   {
//     name: "Trần Khánh Duy",
//     groups: 3,
//     image: "https://via.placeholder.com/50",
//   },
//   { name: "Duy Thuần", groups: 2, image: "https://via.placeholder.com/50" },
//   {
//     name: "Nguyễn Thị Anh Thư",
//     groups: 2,
//     image: "https://via.placeholder.com/50",
//   },
//   { name: "Phạm Hoàng Ý", groups: 2, image: "https://via.placeholder.com/50" },
//   { name: "Lê Long Hoàng", groups: 1, image: "https://via.placeholder.com/50" },
//   { name: "Trí", groups: 2, image: "https://via.placeholder.com/50" },
//   { name: "Tứ", groups: 1, image: "https://via.placeholder.com/50" },
// ];

const FriendRequest = ({ id, friendId, userId, userName, avatar }) => {
  const dispatch = useDispatch();
  const handleRejectFriend = async (id,friendId, userId) => {
    console.log(id, friendId, userId);
  };
  const handleAcceptFriend =async (id,friendId, userId) => {
    console.log(id, friendId, userId);
    let friendDto = {
      userId: userId,
      friendId: friendId,
      status: 1,
    };
    var result=await dispatch(
      UpdateFriend({
        id: id,
        friendDto: friendDto,
      })
    );
    console.log(result)
  };
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <img src={avatar} alt={userName} className="w-12 h-12 rounded-full" />
        <h3 className="text-lg font-semibold">{userName}</h3>
      </div>
      <div className="flex gap-2">
        <button
          className="px-4 py-1 bg-gray-300 text-gray-700 rounded-md"
          onClick={() => handleRejectFriend(id, friendId, userId)}
        >
          Từ chối
        </button>
        <button
          className="px-4 py-1 bg-blue-500 text-white rounded-md"
          onClick={() => handleAcceptFriend(id, friendId, userId)}
        >
          Chấp nhận
        </button>
      </div>
    </div>
  );
};

const FriendSuggestion = ({ userId, userName, avatar }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
      <img src={avatar} alt={userName} className="w-16 h-16 rounded-full mb-2" />
      <h3 className="text-lg font-semibold">{userName}</h3>
      {/* <p className="text-sm text-gray-500">{groups} nhóm chung</p> */}
      <div className="flex gap-2 mt-2">
        <button className="px-4 py-1 bg-gray-300 text-gray-700 rounded-md">
          Bỏ qua
        </button>
        <button className="px-4 py-1 bg-blue-500 text-white rounded-md">
          Kết bạn
        </button>
      </div>
    </div>
  );
};

const FriendSuggestions = () => {
  const [loading, setLoading] = useState(true);
  const friendRequests = useSelector((state) => state.friend.listFriendRequest);
  const users=useSelector((state)=>state.user.listUser)
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(GetFriendRequest(2));
      await dispatch(GetAllUser(2))
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Lời mời kết bạn</h2>
      <div className="mb-6 overflow-y-auto max-h-80">
        {loading ? (
          <p className="text-gray-500 text-center">Đang tải...</p>
        ) : friendRequests.length === 0 ? (
          <p className="text-gray-500">Bạn không có lời mời nào</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {friendRequests.map((request, index) => (
              <FriendRequest key={index} {...request} />
            ))}
          </div>
        )}
      </div>
      <h2 className="text-xl font-semibold mb-4">Gợi ý kết bạn ({users.length})</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto max-h-80">
        {users.map((user, index) => (
          <FriendSuggestion key={index} {...user} />
        ))}
      </div>
    </div>
  );
};

export default FriendSuggestions;
