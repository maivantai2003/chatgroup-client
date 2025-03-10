import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetAllGroupById } from "../redux/group/groupSlice";

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

  // Chỉ lọc khi dữ liệu đã tải xong
  const filteredGroups = loading
    ? [] // Nếu đang tải, không hiển thị nhóm nào
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
    <div className="max-w-5xl mx-auto p-4 w-full">
      <h1 className="text-xl font-bold mb-4">Danh sách nhóm và cộng đồng</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="flex-1 p-2 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="p-2 border rounded"
          onChange={(e) => setSortOrder(e.target.value)}
          value={sortOrder}
        >
          <option value="desc">Hoạt động (nhiều → ít)</option>
          <option value="asc">Hoạt động (ít → nhiều)</option>
        </select>

        <select
          className="p-2 border rounded"
          onChange={(e) => setFilter(e.target.value)}
          value={filter}
        >
          <option value="all">Tất cả</option>
          <option value="small">Nhóm nhỏ (&lt; 10 thành viên)</option>
          <option value="medium">Nhóm vừa (10 - 30 thành viên)</option>
          <option value="large">Nhóm lớn (&gt; 30 thành viên)</option>
        </select>
      </div>

      {/* Hiệu ứng loading */}
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
        <div className="max-h-130 overflow-y-auto border rounded p-2">
          <ul className="space-y-2">
            {filteredGroups.map((group) => (
              <li
                key={group.groupId}
                className="p-3 border rounded flex items-center justify-between relative"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={group.avatar!==null?group.avatar:"https://res.cloudinary.com/dktn4yfpi/image/upload/v1740899136/bv3ndtwp1sosxw9sdvzj.jpg"}
                    alt={group.groupName}
                    className="w-10 h-10 rounded-full border"
                  />
                  <div>
                    <p className="font-medium">{group.groupName}</p>
                    <p className="text-gray-500 text-sm">
                      {group.userNumber} thành viên
                    </p>
                  </div>
                </div>

                {/* Nút menu thả xuống */}
                <button
                  className="p-2"
                  onClick={() =>
                    setOpenMenu(
                      openMenu === group.groupId ? null : group.groupId
                    )
                  }
                >
                  ⋮
                </button>

                {/* Menu thả xuống */}
                {openMenu === group.groupId && (
                  <div className="absolute right-0 top-12 bg-white shadow-md rounded w-32 z-10">
                    <button className="block w-full text-left p-2 hover:bg-gray-200">
                      Phân loại
                    </button>
                    <button className="block w-full text-left p-2 hover:bg-gray-200">
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
