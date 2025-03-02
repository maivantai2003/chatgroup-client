import { useState } from "react";

const groupsData = [
  { id: 1, name: "UX/UI và Lập trình hiện đại", members: 4, avatar: "/images/avatar1.png" },
  { id: 2, name: "505", members: 4, avatar: "/images/avatar2.png" },
  { id: 3, name: "C2 Của Quá Khứ", members: 11, avatar: "/images/avatar3.png" },
  { id: 4, name: "LIFTUP APTIS K18 - Tối 2,4 T3/2025", members: 40, avatar: "/images/avatar4.png" },
  { id: 5, name: "DCT1215-Động Hacker", members: 52, avatar: "/images/avatar5.png" },
  { id: 6, name: "Hay Hẹn Nhưng Bùm Kèo", members: 7, avatar: "/images/avatar6.png" },
  { id: 7, name: "Ai Đi Chơi Thì Vào Nhóm", members: 10, avatar: "/images/avatar7.png" },
  { id: 8, name: "3 ae siu nhân", members: 3, avatar: "/images/avatar8.png" },
];

export default function GroupList() {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filter, setFilter] = useState("all");
  const [openMenu, setOpenMenu] = useState(null);

  const filteredGroups = groupsData
    .filter((group) =>
      group.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "desc" ? b.members - a.members : a.members - b.members
    )
    .filter((group) => {
      if (filter === "all") return true;
      if (filter === "small") return group.members < 10;
      if (filter === "medium") return group.members >= 10 && group.members <= 30;
      if (filter === "large") return group.members > 30;
      return true;
    });

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Danh sách nhóm và cộng đồng</h1>
      
      {/* Thanh tìm kiếm */}
      <input
        type="text"
        placeholder="Tìm kiếm..."
        className="w-full p-2 border rounded mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      
      {/* Bộ lọc và sắp xếp */}
      <div className="flex justify-between mb-4">
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
      
      {/* Danh sách nhóm với cuộn */}
      <div className="max-h-130 overflow-y-auto border rounded p-2">
        <ul className="space-y-2">
          {filteredGroups.map((group) => (
            <li
              key={group.id}
              className="p-3 border rounded flex items-center justify-between relative"
            >
              <div className="flex items-center space-x-3">
                <img src={group.avatar} alt={group.name} className="w-10 h-10 rounded-full border" />
                <div>
                  <p className="font-medium">{group.name}</p>
                  <p className="text-gray-500 text-sm">{group.members} thành viên</p>
                </div>
              </div>
              
              {/* Nút menu thả xuống */}
              <button
                className="p-2"
                onClick={() => setOpenMenu(openMenu === group.id ? null : group.id)}
              >
                ⋮
              </button>

              {/* Menu thả xuống */}
              {openMenu === group.id && (
                <div className="absolute right-0 top-12 bg-white shadow-md rounded w-32 z-10">
                  <button className="block w-full text-left p-2 hover:bg-gray-200">Phân loại</button>
                  <button className="block w-full text-left p-2 hover:bg-gray-200">Rời nhóm</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
