import { UserPlusIcon, UsersIcon } from "@heroicons/react/outline";

const ActionButtons = () => {
  return (
    <div className="flex space-x-4">
      {/* Nút Thêm Bạn */}
      <button className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition">
        <UserPlusIcon className="w-6 h-6 text-gray-700" />
      </button>

      {/* Nút Thêm Vào Nhóm */}
      <button className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition">
        <UsersIcon className="w-6 h-6 text-gray-700" />
      </button>
    </div>
  );
};

export default ActionButtons;
