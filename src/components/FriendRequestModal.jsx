import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

const friends = Array.from({ length: 20 }, (_, i) => ({
  name: `Người bạn ${i + 1}`,
  avatar: `https://i.pravatar.cc/40?img=${i + 1}`,
}));

const FriendRequestModal = ({ isOpen, closeModal }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        {/* Nền mờ trong suốt */}
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
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white bg-opacity-80 p-6 text-left shadow-xl backdrop-blur-lg transition-all">
              <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
                Thêm bạn
              </Dialog.Title>

              {/* Input nhập số điện thoại */}
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Nhập số điện thoại"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Danh sách bạn bè có scroll */}
              <div className="mt-4 max-h-60 overflow-y-auto space-y-2">
                {friends.map((friend, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center space-x-3">
                      <img src={friend.avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
                      <span className="text-gray-700">{friend.name}</span>
                    </div>
                    <button className="px-3 py-1 bg-blue-500 text-white rounded-md">
                      Kết bạn
                    </button>
                  </div>
                ))}
              </div>

              {/* Nút đóng */}
              <div className="mt-4 flex justify-end">
                <button onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded-md">
                  Đóng
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default FriendRequestModal;
