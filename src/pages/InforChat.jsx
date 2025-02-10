const InforChat=()=>{
    return <div className="w-1/4 bg-white p-4">
    <div className="font-bold">Thông tin hội thoại</div>
    <div className="mt-4">
      <div className="font-bold">File</div>
      <div className="mt-2">
        <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
          <div className="flex items-center">
            <i className="fas fa-file-pdf text-red-500"></i>
            <div className="ml-2">
              <div className="text-sm">ontap%20(1).pdf</div>
              <div className="text-xs text-gray-600">
                455.54 KB · 31/12/2024
              </div>
            </div>
          </div>
          <i className="fas fa-check-circle text-green-500"></i>
        </div>
        <div className="flex items-center justify-between p-2 bg-gray-100 rounded mt-2">
          <div className="flex items-center">
            <i className="fas fa-file-word text-blue-500"></i>
            <div className="ml-2">
              <div className="text-sm">Ôn Cuối Kỳ chốt.docx</div>
              <div className="text-xs text-gray-600">
                9.8 MB · 25/12/2024
              </div>
            </div>
          </div>
          <i className="fas fa-check-circle text-green-500"></i>
        </div>
        <div className="flex items-center justify-between p-2 bg-gray-100 rounded mt-2">
          <div className="flex items-center">
            <i className="fas fa-file-word text-blue-500"></i>
            <div className="ml-2">
              <div className="text-sm">
                Nội dung on tap QLDA PM.docx
              </div>
              <div className="text-xs text-gray-600">
                29.71 KB · 21/12/2024
              </div>
            </div>
          </div>
          <i className="fas fa-check-circle text-green-500"></i>
        </div>
      </div>
      <button className="mt-2 text-blue-500">Xem tất cả</button>
    </div>
    <div className="mt-4">
      <div className="font-bold">Link</div>
      <div className="mt-2">
        <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
          <div className="flex items-center">
            <i className="fas fa-link text-blue-500"></i>
            <div className="ml-2">
              <div className="text-sm">
                Release 3.0.504 · microsoftarchive/redis
              </div>
              <div className="text-xs text-gray-600">Hôm nay</div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between p-2 bg-gray-100 rounded mt-2">
          <div className="flex items-center">
            <i className="fas fa-link text-blue-500"></i>
            <div className="ml-2">
              <div className="text-sm">
                Sleigh Ride (Indian Christmas Remix)
              </div>
              <div className="text-xs text-gray-600">29/12</div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between p-2 bg-gray-100 rounded mt-2">
          <div className="flex items-center">
            <i className="fas fa-link text-blue-500"></i>
            <div className="ml-2">
              <div className="text-sm">
                LỜI BÁC HỒ DẠY NGÀY 29/01/1957: “...
              </div>
              <div className="text-xs text-gray-600">22/12</div>
            </div>
          </div>
        </div>
      </div>
      <button className="mt-2 text-blue-500">Xem tất cả</button>
    </div>
  </div>
}
export default InforChat;