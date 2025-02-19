import { useState } from "react";

const SelectMethod = () => {
  const [message, setMessage] = useState("");
  return (
    <div className="p-4 bg-gray-200 flex items-center">
      <input
       value={message}
       onChange={(e) => {setMessage(e.target.value)
        console.log(e.target.value);
       }}
      className="flex-1 p-2 rounded bg-white"
        placeholder="Nhập @, tin nhắn tới"
      />
      
      <div className="flex items-center space-x-4 ml-4">
        {message !== "" ? (
          <i className="fas fa-paper-plane text-blue-500 text-xl cursor-pointer"></i>
        ) : (
          <i className="l"></i>
        )}
        <i className="fas fa-smile"></i>
        <i className="fas fa-paperclip"></i>
        <i className="fas fa-microphone"></i>
        <i className="fas fa-ellipsis-v"></i>
      </div>
    </div>
  );
};
export default SelectMethod;
