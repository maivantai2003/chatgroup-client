import { useState } from "react";

const SelectMethod = ({name}) => {
  const [message, setMessage] = useState("");
  return (
    <div className="p-4 bg-gray-200 flex items-center sticky bottom-0 w-full">
      <input
       value={message}
       onChange={(e) => {setMessage(e.target.value)
        console.log(e.target.value);
       }}
      className="flex-1 p-2 rounded bg-white outline-none border border-transparent focus:ring-0 focus:border-transparent"
        placeholder={`Nhập @, tin nhắn tới ${name}`}
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
