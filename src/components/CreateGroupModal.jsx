import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetAllFriendById } from "../redux/friend/friendSlice";
import axios from "axios";
import config from "../constant/linkApi";
import { CreateGroup } from "../redux/group/groupSlice";
import { CreateGroupDetail } from "../redux/groupdetail/groupdetailSlice";
import { toast } from "react-toastify";
import { CreateConversation } from "../redux/conversation/conversationSlice";
import { SignalRContext } from "../context/SignalRContext";
const CreateGroupModal = ({ isOpen, closeModal, id }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const connection = useContext(SignalRContext);
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
  const filteredUsers = users.filter((user) =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );
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
      if (groupName.trim() === "" || groupName === undefined) {
        toast.warning("Vui lòng nhập tên nhóm");
        return;
      }
      const groupDto = {
        groupName: groupName,
        avatar: selectedImage,
      };
      // create group
      var result = await dispatch(CreateGroup(groupDto)).unwrap();
      if (result !== null && result.groupId > 0) {
        var groupId = result.groupId;
        const groupDetails = [
          { userId: id, groupId: groupId, role: "Admin" },
          ...selectedUsers.map((userId) => ({
            userId: userId,
            groupId: groupId,
            role: "Member",
          })),
        ];
        //create detail group
        const createGroupDetailPromises = groupDetails.map((groupDetailDto) =>
          dispatch(CreateGroupDetail(groupDetailDto)).unwrap()
        );
        const createGroupDetails = await Promise.all(createGroupDetailPromises);
        console.log(createGroupDetails);
        var listConversation = groupDetails.map((conversation) => ({
          id: groupId,
          userId: conversation.userId,
          avatar: result.avatar,
          conversationName: result.groupName,
          userSend: "",
          type: "group",
          content: `${
            conversation.userId === id
              ? "Bạn đã tạo nhóm " + result.groupName
              : "Bạn đã được thêm vào nhóm " + result.groupName
          }`,
        }));
        //create conversation
        const createConversationPromises = listConversation.map(
          (conversationDto) =>
            dispatch(CreateConversation(conversationDto)).unwrap()
        );
        const listConversations = await Promise.all(createConversationPromises);
        console.log(listConversations);
        if (connection) {
          listConversations
            .filter((user) => user.userId !== id)
            .forEach((conversation) => {
              connection.invoke(
                "AddConversationMemberGroup",
                conversation.userId.toString(),
                conversation
              );
            });
        }
        toast.success("Tạo nhóm thành công");
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Tabs bộ lọc */}
              {/* <div className="mt-3 flex space-x-2 text-sm text-gray-600">
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
              </div> */}

              {/* Danh sách thành viên có scroll */}
              <div className="mt-3 max-h-60 overflow-y-auto space-y-2">
                {loading ? (
                  <p className="text-gray-500 text-center">Đang tải...</p>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
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
                ) : (
                  <p className="text-gray-500 text-center">
                    Không tìm thấy kết quả
                  </p>
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
