import { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { FaRemoveFormat, FaTrash, FaUser } from "react-icons/fa";
import { CreateCloudMessage } from "../redux/cloudmessage/cloudmessageSlice";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { UpdateConversation } from "../redux/conversation/conversationSlice";
import axios from "axios";
import config from "../constant/linkApi";
const fileIcons = {
  pdf: "fas fa-file-pdf text-red-500",
  doc: "fas fa-file-word text-blue-500",
  docx: "fas fa-file-word text-blue-500",
  xls: "fas fa-file-excel text-green-500",
  xlsx: "fas fa-file-excel text-green-500",
  ppt: "fas fa-file-powerpoint text-orange-500",
  pptx: "fas fa-file-powerpoint text-orange-500",
  txt: "fas fa-file-alt text-gray-500",
  zip: "fas fa-file-archive text-purple-500",
  rar: "fas fa-file-archive text-purple-500",
  default: "fas fa-file text-gray-500",
};
const imageExtensions = ["jpg", "jpeg", "png", "gif"];

const SelectMethod = ({ userId, conversationName, type, conversationId }) => {
  const [message, setMessage] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const pickerRef = useRef(null);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const handleSendMessage = async () => {
    if (message.trim() !== "" || selectedFiles.length > 0) {
      console.log(message)
      let uploadedFiles = [];
      if (selectedFiles.length > 0) {
        const uploadPromises = selectedFiles.map((file) =>
          uploadFileToCloudinary(file)
        );
        uploadedFiles = await Promise.all(uploadPromises)
        uploadedFiles = uploadedFiles.filter((file) => file !== null);
      }
      console.log(uploadedFiles)
      let cloudMessageDto = {
        userId: userId,
        content: message,
        type: selectedFiles.length === 0 ? "text" : "file",
      };
      try {
        var result = await dispatch(
          CreateCloudMessage(cloudMessageDto)
        ).unwrap();
        if (result !== null && result.cloudMessageId > 0) {
          let conversationUpdateDto = {
            conversationId: conversationId,
            userSend: "Bạn",
            content: message,
          };
          var resultUpdateConversation = await dispatch(
            UpdateConversation({
              id: conversationId,
              conversationUpdateDto: conversationUpdateDto,
            })
          ).unwrap();
          console.log(resultUpdateConversation);
          if (
            resultUpdateConversation !== null &&
            resultUpdateConversation.conversationId > 0
          ) {
            toast.success("Cập nhật conversation thành công");
          }
        } else {
          toast.error("Gửi tin nhắn không thành công");
          console.log(result);
        }
      } catch (ex) {
        console.log(ex);
      }
      console.log("Gửi tin nhắn:", message);
      console.log("Gửi file:", selectedFiles);
      setMessage("");
      setSelectedFiles([]);
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const filesWithPreview = files.map((file) => ({
      file,
      preview: imageExtensions.includes(
        file.name.split(".").pop().toLowerCase()
      )
        ? URL.createObjectURL(file)
        : null,
    }));
    setSelectedFiles((prevFiles) => [...prevFiles, ...filesWithPreview]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const filesWithPreview = files.map((file) => ({
      file,
      preview: imageExtensions.includes(
        file.name.split(".").pop().toLowerCase()
      )
        ? URL.createObjectURL(file)
        : null,
    }));
    setSelectedFiles((prevFiles) => [...prevFiles, ...filesWithPreview]);
  };
  const uploadFileToCloudinary = async (file) => {
    var fileDetail=file.file
    const formData = new FormData();
    formData.append("file", fileDetail);
    const fileInfo = {
      TenFile: fileDetail.name,
      KichThuocFile: formatFileSize(fileDetail.size),
      LoaiFile: fileDetail.name.split(".").pop(),
    };
    try {
      const response = await axios.post( `${config.API_URL}/File/Upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return {
        ...fileInfo,
        DuongDan: response.data.url,
      };
    } catch (error) {
      console.error("Lỗi upload file:", error);
      return null;
    }
  };
  const formatFileSize = (size) => {
    if (size === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      if (updatedFiles[index].preview) {
        URL.revokeObjectURL(updatedFiles[index].preview);
      }
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };

  const handleClearFiles = () => {
    selectedFiles.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setSelectedFiles([]);
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getFileIcon = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    return fileIcons[ext] || fileIcons.default;
  };

  return (
    <div
      className="p-4 bg-gray-200 flex flex-col sticky bottom-0 w-full"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          className="flex-1 p-2 rounded bg-white outline-none border border-transparent focus:ring-0 focus:border-transparent"
          placeholder={`Nhập @, tin nhắn tới ${conversationName}`}
        />

        <div className="flex items-center space-x-4 ml-4">
          {(message.trim() !== "" || selectedFiles.length > 0) && (
            <i
              className="fas fa-paper-plane text-blue-500 text-xl cursor-pointer"
              onClick={handleSendMessage}
            ></i>
          )}

          <i
            className="fas fa-smile cursor-pointer"
            onClick={() => setShowPicker(!showPicker)}
          ></i>

          <i
            className="fas fa-paperclip cursor-pointer"
            onClick={() => fileInputRef.current.click()}
          ></i>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            onChange={handleFileChange}
          />

          <i className="fas fa-microphone"></i>
          <i className="fas fa-ellipsis-v"></i>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="bg-white p-2 rounded shadow mt-2 flex flex-wrap">
          {selectedFiles.map((fileData, index) => (
            <div
              key={index}
              className="flex items-center p-1 border rounded m-1"
            >
              {fileData.preview ? (
                <img
                  src={fileData.preview}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded mr-2"
                />
              ) : (
                <i
                  className={`${getFileIcon(fileData.file.name)} text-lg mr-2`}
                ></i>
              )}
              <span className="text-sm truncate max-w-[120px]">
                {fileData.file.name}
              </span>
              <i
                className="fas fa-times text-red-500 ml-2 cursor-pointer"
                onClick={() => handleRemoveFile(index)}
              ></i>
            </div>
          ))}
          <button
            className="text-red-500 text-sm ml-2 hover:underline"
            onClick={handleClearFiles}
          >
            <FaTrash />
          </button>
        </div>
      )}

      {showPicker && (
        <div
          ref={pickerRef}
          className="absolute bottom-12 right-4 bg-white shadow-lg rounded"
        >
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  );
};

export default SelectMethod;
