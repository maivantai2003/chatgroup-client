import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetAllGroupById } from "../redux/group/groupSlice";
import { FaEllipsisV } from "react-icons/fa"; // Icon menu
import { FiLogOut } from "react-icons/fi"; // Icon rời nhóm
import { MdLabelOutline } from "react-icons/md"; // Icon phân loại

export default function GroupList({ id }) {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("desc");
  const [filter, setFilter] = useState("all");
  const [openMenu, setOpenMenu] = useState(null);
  
  const dispatch = useDispatch();
  const listGroup = useSelector((state) => state.group.listGroupUser);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(GetAllGroupById(id));
      setLoading(false);
    };
    fetchData();
  }, [dispatch, id]);

  const filteredGroups = loading
    ? []
    : listGroup
        .filter((group) =>
          group.groupName.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) =>
          sortOrder === "desc"
            ? b.userNumber - a.userNumber
            : a.userNumber - b.userNumber
        )
        .filter((group) => {
          if (filter === "all") return true;
          if (filter === "small") return group.userNumber < 10;
          if (filter === "medium")
            return group.userNumber >= 10 && group.userNumber <= 30;
          if (filter === "large") return group.userNumber > 30;
          return true;
        });

  return (
    <div className="max-w-4xl mx-auto p-4 w-full">
      <h1 className="text-xl font-bold mb-4">Danh sách nhóm</h1>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="flex-1 p-2 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <svg
            className="animate-spin h-10 w-10 text-blue-500"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        </div>
      ) : (
        <div className="max-h-[500px] overflow-y-auto border rounded p-2 bg-white shadow">
          <ul className="space-y-2">
            {filteredGroups.map((group) => (
              <li
                key={group.groupId}
                className="p-3 flex items-center justify-between rounded-lg hover:bg-gray-100 cursor-pointer transition relative"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={
                      group.avatar !== null
                        ? group.avatar
                        : "https://res.cloudinary.com/dktn4yfpi/image/upload/v1740899136/bv3ndtwp1sosxw9sdvzj.jpg"
                    }
                    alt={group.groupName}
                    className="w-12 h-12 rounded-full border object-cover"
                  />
                  <div>
                    <p className="font-medium text-lg">{group.groupName}</p>
                    <p className="text-gray-500 text-sm">
                      {group.userNumber} thành viên
                    </p>
                  </div>
                </div>

                {/* Nút menu */}
                <button
                  className="p-2"
                  onClick={() =>
                    setOpenMenu(openMenu === group.groupId ? null : group.groupId)
                  }
                >
                  <FaEllipsisV className="text-gray-600" />
                </button>

                {/* Menu popover */}
                {openMenu === group.groupId && (
                  <div className="absolute right-0 top-12 bg-white shadow-lg rounded-lg w-40 z-10 border p-2">
                    <button className="flex items-center w-full text-left p-2 hover:bg-gray-200 rounded">
                      <MdLabelOutline className="mr-2" />
                      Phân loại
                    </button>
                    <button className="flex items-center w-full text-left p-2 hover:bg-gray-200 rounded">
                      <FiLogOut className="mr-2" />
                      Rời nhóm
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
