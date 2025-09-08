import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetAllGroupById } from "../redux/group/groupSlice";
import { FaEllipsisV } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

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
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Danh sách nhóm</h1>

      {/* Search + Filter + Sort */}
      <div className="flex items-center gap-3 mb-4">
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm nhóm..."
            className="w-full pl-10 pr-4 py-2 border rounded-full shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <svg
            className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
        </div>

        {/* Filter */}
        <select
          className="p-2 border rounded-lg bg-white shadow-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Tất cả</option>
          <option value="small">Nhỏ (&lt;10)</option>
          <option value="medium">Vừa (10-30)</option>
          <option value="large">Lớn (&gt;30)</option>
        </select>

        {/* Sort */}
        <button
          onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
          className="p-2 border rounded-lg bg-white shadow-sm hover:bg-gray-100"
        >
          {sortOrder === "desc" ? "⬇️" : "⬆️"}
        </button>
      </div>

      {/* Content */}
      {loading ? (
        // Skeleton loader
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-100 animate-pulse"
            >
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-h-[400px] overflow-y-auto space-y-3">
          {filteredGroups.map((group) => (
            <div
              key={group.groupId}
              className="p-4 flex items-center justify-between rounded-xl bg-white shadow-sm hover:shadow-md hover:bg-gray-50 transition relative"
            >
              <div className="flex items-center gap-3">
                <img
                  src={
                    group.avatar
                      ? group.avatar
                      : "https://ui-avatars.com/api/?name=" +
                        group.groupName
                  }
                  alt={group.groupName}
                  className="w-12 h-12 rounded-full border object-cover shadow"
                />
                <div>
                  <p className="font-semibold text-gray-800">
                    {group.groupName}
                  </p>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600">
                    {group.userNumber} thành viên
                  </span>
                </div>
              </div>

              {/* Nút menu */}
              <button
                className="p-2 hover:bg-gray-200 rounded-full"
                onClick={() =>
                  setOpenMenu(
                    openMenu === group.groupId ? null : group.groupId
                  )
                }
              >
                <FaEllipsisV className="text-gray-600" />
              </button>

              {/* Menu popover */}
              {openMenu === group.groupId && (
                <div className="absolute right-0 top-14 bg-white shadow-lg rounded-xl w-44 z-10 border p-2 animate-fadeIn">
                  <button className="flex items-center w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg">
                    <FiLogOut className="mr-2 text-red-500" />
                    <span className="text-red-500">Rời nhóm</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* Tailwind custom animation */
<style jsx global>{`
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fadeIn {
    animation: fadeIn 0.2s ease-in-out;
  }
`}</style>
