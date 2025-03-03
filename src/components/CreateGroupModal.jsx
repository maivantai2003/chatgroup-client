import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetAllFriendById } from "../redux/friend/friendSlice";
import axios from "axios";
import config from "../constant/linkApi";
import { CreateGroup } from "../redux/group/groupSlice";
import { CreateGroupDetail } from "../redux/groupdetail/groupdetailSlice";
import { toast } from "react-toastify";
// const users = Array.from({ length: 20 }, (_, i) => ({
//   name: `Thành viên ${i + 1}`,
//   avatar: `https://i.pravatar.cc/40?img=${i + 1}`,
// }));
const CreateGroupModal = ({ isOpen, closeModal, id }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [groupName, setGroupName] = useState("");
  const dispatch = useDispatch();
  const users = useSelector((state) => state.friend.listFriend);
  const toggleUser = (user) => {
    setSelectedUsers((prev) => {
      const updatedUsers = prev.includes(user.friendId)
        ? prev.filter((id) => id !== user.friendId)
        : [...prev, user.friendId];

      console.log("Danh sách đã chọn:", updatedUsers);
      return updatedUsers;
    });
  };
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await dispatch(GetAllFriendById(id));
      setLoading(false);
    };
    loadData();
  }, [dispatch]);
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedImage(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const response = await axios.post(
        `${config.API_URL}/File/Upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        console.log("Ảnh đã upload:", response.data.url);
        setSelectedImage(response.data.url);
      } else {
        console.error("Lỗi khi upload ảnh:", response.data);
      }
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
    } finally {
      setUploading(false);
    }
  };
  const handleCreateGroup = async () => {
    try {
      const groupDto = {
        groupName: groupName,
        avatar: selectedImage,
      };
      var result = await dispatch(CreateGroup(groupDto)).unwrap();
      var groupId = result.groupId;
      if (result !== null) {
        const groupDetails = [
          { userId: id, groupId: groupId, role: "Admin" },
          ...selectedUsers.map((userId) => ({
            userId: userId,
            groupId: groupId,
            role: "Member",
          })),
        ];

        for (const groupDetailDto of groupDetails) {
          await dispatch(CreateGroupDetail(groupDetailDto));
        }
        toast("Tạo nhóm thành công");
      } else {
        toast.error("Tạo nhóm không thành công");
        return;
      }
    } catch (ex) {
      console.log(ex);
    }

    closeModal();
    resetModal();
  };
  const resetModal = () => {
    setSelectedUsers([]);
    setSelectedImage(null);
    setGroupName("");
  };
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        {/* Nền mờ */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-transparent backdrop-blur-md" />
        </Transition.Child>

        {/* Modal */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-md bg-white bg-opacity-80 backdrop-blur-lg rounded-xl p-6 shadow-lg">
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                Tạo nhóm
              </Dialog.Title>

              {/* Nhập tên nhóm */}
              <div className="mt-3 flex items-center space-x-3">
                <label
                  htmlFor="upload-image"
                  className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer"
                >
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt="Group Avatar"
                      className="w-full h-full rounded-full"
                    />
                  ) : (
                    "📷"
                  )}
                </label>
                <input
                  id="upload-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <input
                  type="text"
                  placeholder="Nhập tên nhóm..."
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-blue-500"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>
              {uploading && (
                <p className="text-blue-500 text-sm">Đang tải ảnh...</p>
              )}
              {/* Thanh tìm kiếm */}
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Nhập tên, số điện thoại..."
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Tabs bộ lọc */}
              <div className="mt-3 flex space-x-2 text-sm text-gray-600">
                {["Tất cả", "Khách hàng", "Gia đình", "Công việc"].map(
                  (tab) => (
                    <button
                      key={tab}
                      className="px-3 py-1 bg-gray-200 rounded-full"
                    >
                      {tab}
                    </button>
                  )
                )}
              </div>

              {/* Danh sách thành viên có scroll */}
              <div className="mt-3 max-h-60 overflow-y-auto space-y-2">
                {loading ? (
                  <p className="text-gray-500 text-center">Đang tải...</p>
                ) : (
                  users.map((user, index) => (
                    <label
                      key={index}
                      className="flex items-center space-x-3 p-2 border rounded-md cursor-pointer hover:bg-gray-100"
                    >
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.friendId)}
                        onChange={() => toggleUser(user)}
                        className="w-4 h-4"
                      />
                      <img
                        src={user.avatar}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full"
                      />
                      <span className="text-gray-700">{user.userName}</span>
                    </label>
                  ))
                )}
              </div>

              {/* Nút hành động */}
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => {
                    closeModal();
                    resetModal();
                  }}
                  className="px-4 py-2 bg-gray-300 rounded-md"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreateGroup}
                  disabled={selectedUsers.length === 0}
                  className={`px-4 py-2 rounded-md ${
                    selectedUsers.length > 0
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300"
                  }`}
                >
                  Tạo nhóm
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CreateGroupModal;
