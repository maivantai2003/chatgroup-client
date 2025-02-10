const SelectMethod=()=>{
    return <div className="p-4 bg-gray-200 flex items-center">
    <input
      className="flex-1 p-2 rounded bg-white"
      placeholder="Nhập @, tin nhắn tới"
      type="text"
    />
    <div className="flex items-center space-x-4 ml-4">
      <i className="fas fa-smile"></i>
      <i className="fas fa-paperclip"></i>
      <i className="fas fa-microphone"></i>
      <i className="fas fa-ellipsis-v"></i>
    </div>
  </div>
}
export default SelectMethod;