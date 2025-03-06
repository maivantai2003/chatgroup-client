const GroupInfo = ({ conversation }) => {
  return (
    <div>
      <div className="font-bold text-center">Thông tin nhóm</div>
      <div className="mt-4 flex flex-col items-center">
        {/* <div className="flex -space-x-2">
          {conversation.avatars.map((avatar, index) => (
              <img
                key={index}
                src={avatar}
                className="w-10 h-10 rounded-full border border-white"
                alt="Avatar"
              />
            ))}
        </div> */}
        <img
          src={conversation.avatar}
          className="w-16 h-16 rounded-full"
          alt="Avatar"
        />
        <div className="font-bold mt-2 flex items-center">
          {conversation.conversationName}
          <i className="fas fa-pen ml-2 cursor-pointer text-gray-500"></i>
        </div>
      </div>
      <div className="flex justify-around mt-4">
        <button className="flex flex-col items-center">
          <i className="fas fa-bell text-lg"></i>
          <span className="text-xs">Tắt thông báo</span>
        </button>
        <button className="flex flex-col items-center">
          <i className="fas fa-thumbtack text-lg"></i>
          <span className="text-xs">Ghim hội thoại</span>
        </button>
        <button className="flex flex-col items-center">
          <i className="fas fa-user-plus text-lg"></i>
          <span className="text-xs">Thêm thành viên</span>
        </button>
      </div>
      <div className="mt-4">
        <div className="font-bold">Thành viên nhóm</div>
        <div className="flex items-center justify-between mt-2">
          {/* <span>{conversation.members.length} thành viên</span>
            <a href={conversation.groupLink} className="text-blue-500">
              Link tham gia nhóm
            </a> */}
        </div>
      </div>
      <div className="mt-4">
        <div className="font-bold">Ảnh/Video</div>
        <div className="grid grid-cols-3 gap-1 mt-2">
          {/* {conversation.media.map((item, index) => (
            <img
              key={index}
              src={item}
              className="w-20 h-20 object-cover rounded"
              alt="Media"
            />
          ))} */}
        </div>
        <button className="mt-2 text-blue-500">Xem tất cả</button>
      </div>
      <div className="mt-4">
        <div className="font-bold">File</div>
        {/* {conversation.files.map((file, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 bg-gray-100 rounded mt-2"
          >
            <div className="flex items-center">
              <i className={`fas fa-file-${file.type} text-blue-500`}></i>
              <div className="ml-2">
                <div className="text-sm">{file.name}</div>
                <div className="text-xs text-gray-600">
                  {file.size} KB · {file.date}
                </div>
              </div>
            </div>
            <i className="fas fa-check-circle text-green-500"></i>
          </div>
        ))} */}
        <button className="mt-2 text-blue-500">Xem tất cả</button>
      </div>
    </div>
  );
};

export default GroupInfo;
