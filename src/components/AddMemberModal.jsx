import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FaUserPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { GetAllFriendById } from "../redux/friend/friendSlice";
import { CreateGroupDetail } from "../redux/groupdetail/groupdetailSlice";
import { CreateConversation, UpdateConversation } from "../redux/conversation/conversationSlice";
import { GetGroupById } from "../redux/group/groupSlice";
import { useSignalR } from "../context/SignalRContext";

const AddMemberModal = ({
  isOpen,
  onClose,
  userId,
  groupId,
  groupName,
  avatar,
  groupMembers,
}) => {
  const friends = useSelector((state) => state.friend.listFriend);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  //const connection=useSignalR()
  console.log(groupMembers)
  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setLoading(true);
        await dispatch(GetAllFriendById(userId));
        setLoading(false);
      };
      fetchData();
    }
  }, [dispatch, userId, isOpen, groupId]);
  if (loading) {
    return (
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
              <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    );
  }
  const availableFriends = friends.filter(
    (friend) =>
      !groupMembers.some((member) => member.userId === friend.friendId)
  );

  const handleSelectMember = (friend) => {
    setSelectedMembers((prev) => {
      const isSelected = prev.some((member) => member.id === friend.friendId);
      if (isSelected) {
        return prev.filter((member) => member.id !== friend.friendId);
      } else {
        return [...prev, { id: friend.friendId, name: friend.userName }];
      }
    });
  };

  const handleConfirm = async () => {
    try {
      if (selectedMembers.length === 0) return;
      const groupDetails = [
        ...selectedMembers.map((member) => ({
          userId: member.id,
          groupId: groupId,
          role: "Member",
        })),
      ];
      if (groupDetails.length > 0) {
        await Promise.all(
          groupDetails.map((groupDetailDto) =>
            dispatch(CreateGroupDetail(groupDetailDto))
          )
        );
      }
      var listConversation = groupDetails.map((conversation) => ({
        id: groupId,
        userId: conversation.userId,
        avatar: avatar,
        conversationName: groupName,
        userSend: "",
        type: "group",
        content: `${"Bạn đã được thêm vào nhóm " + groupName}`,
      }));
      await Promise.all(
        listConversation.map((conversationDto) =>
          dispatch(CreateConversation(conversationDto))
        )
      );
      console.log(listConversation);
      if (groupMembers.length > 0) {
        let listConversation = groupMembers.map((member) => ({
          userId: member.userId,
          id: groupId,
          type: "group",
          userSend: "",
          content:
            selectedMembers.map((member) => member.name).join(", ") +
            " được thêm vào nhóm",
        }));
        await Promise.all(
          listConversation.map((conversationUpdateDto) =>
            dispatch(UpdateConversation(conversationUpdateDto))
          )
        );
        console.log(listConversation)
      }
      setSelectedMembers([]);
      await dispatch(GetGroupById(groupId))
      // if (connection) {
      //   await Promise.all(
      //     selectedMembers.map(async (member) => {
      //       try {
      //         await connection.invoke("AddMemberToGroup", member.id.toString());
      //       } catch (err) {
      //         console.error(`Lỗi khi gửi thông báo cho ${member.name}:`, err);
      //       }
      //     })
      //   );
      // }
      onClose();
    } catch (ex) {
      console.error("Lỗi khi thêm thành viên vào nhóm:", error);
    }
  };
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Overlay background */}
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

        {/* Modal Content */}
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
            <Dialog.Panel className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
              <Dialog.Title className="text-lg font-bold">
                Thêm thành viên vào nhóm
              </Dialog.Title>

              {/* Input tìm kiếm */}
              <input
                type="text"
                placeholder="Nhập tên hoặc số điện thoại"
                className="w-full p-2 border rounded-md mt-2 mb-4"
              />

              {/* Danh sách bạn bè */}
              <div className="max-h-60 overflow-y-auto">
                {availableFriends.length > 0 ? (
                  availableFriends.map((friend) => (
                    <div
                      key={friend.friendId}
                      className="flex items-center justify-between p-2 border-b hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelectMember(friend)}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={friend.avatar}
                          alt={friend.userName}
                          className="w-10 h-10 rounded-full"
                        />
                        <span>{friend.userName}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedMembers.some(
                          (member) => member.id === friend.friendId
                        )}
                        readOnly
                        className="w-4 h-4"
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center">
                    Không có bạn bè nào có thể thêm
                  </p>
                )}
              </div>

              {/* Nút Hủy & Xác nhận */}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="px-4 py-2 bg-gray-300 rounded-md"
                  onClick={onClose}
                >
                  Hủy
                </button>
                <button
                  className={`px-4 py-2 rounded-md text-white ${
                    selectedMembers.length > 0 ? "bg-blue-500" : "bg-gray-400"
                  }`}
                  disabled={selectedMembers.length === 0}
                  onClick={handleConfirm}
                >
                  Xác nhận
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddMemberModal;
