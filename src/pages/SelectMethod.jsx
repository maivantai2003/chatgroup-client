import { useContext, useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { FaRemoveFormat, FaTrash, FaUser } from "react-icons/fa";
import {
  addFilesToCloudMessage,
  CreateCloudMessage,
} from "../redux/cloudmessage/cloudmessageSlice";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  UpdateConversation,
  UpdateConversationGroup,
  updateConversationInState,
} from "../redux/conversation/conversationSlice";
import axios from "axios";
import config from "../constant/linkApi";
import { formatFileSize } from "../helpers/formatFileSize";
import {
  addFilesToUserMessage,
  addUserMessage,
  CreateUserMessage,
} from "../redux/usermessage/usermessageSlice";
import {
  addFilesToGroupMessage,
  AddGroupMessage,
  addGroupMessageInstance,
} from "../redux/groupmessage/groupmessageSlice";
import { SignalRContext } from "../context/SignalRContext";
import { GetGroupById } from "../redux/group/groupSlice";
import { CreateFile } from "../redux/file/fileSlice";
import { AddCloudMessageFile } from "../redux/cloudmessagefile/cloudmessagefileSlice";
import { AddUserMessageFile } from "../redux/usermessagefile/usermessagefileSlice";
import { AddGroupMessageFile } from "../redux/groupmessagefile/groupmessagefileSlice";
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
const MAX_FILE_SIZE = 25 * 1024 * 1024;
const SelectMethod = ({
  userId,
  id,
  conversationName,
  type,
  conversationId,
}) => {
  const [message, setMessage] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const pickerRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [typingGroup, setTypingGroup] = useState(null);
  const [listGroupUser, setListGroupUser] = useState(null);
  const [uploadProgress, setUploadProgress] = useState([]);
  const dispatch = useDispatch();
  var userInfor = JSON.parse(localStorage.getItem("user"));
  var userName = userInfor.UserName || "user";
  const connection = useContext(SignalRContext);
  const groupUsers = useSelector((state) => state.group.group);
  useEffect(() => {
    if (connection) {
      connection.on("ReceiveHoverUserMessage", (receiverId, value) => {
        if (receiverId === userId.toString()) {
          setTypingUser(value);
        }
        //setTypingUser(value);
      });
      connection.on("ReceiveHoverGroupMessage", (senderId, groupId, value) => {
        if (userId.toString() !== senderId && groupId === id.toString()) {
          setTypingGroup(value);
        }
      });
      return () => {
        connection.off("ReceiveHoverUserMessage");
        connection.off("ReceiveHoverGroupMessage");
      };
    }
  }, [connection, id]);
  useEffect(() => {
    if (type === "group") {
      const fetchData = async () => {
        //await dispatch(GetGroupById(id))
        setListGroupUser(groupUsers);
      };
      fetchData();
    }
  }, [type, id, dispatch, groupUsers]);
  useEffect(() => {
    setMessage("");
    setTypingUser(null);
    setTypingGroup(null);
  }, [conversationId]);
  const handleSendMessage = async () => {
    try {
      if (message.trim() !== "" || selectedFiles.length > 0) {
        if (type === "cloud") {
          await handleSendCloudMessage();
        } else if (type === "user") {
          console.log("user");
          await handleSendUserMessage();
        } else {
          console.log("group");
          await handleSendGroupMessage();
        }
        // setMessage("");
        // setSelectedFiles([]);
      }
    } catch (ex) {
      console.log(ex);
    }
  };
  const handleSendCloudMessage = async () => {
    console.log(message);
    let uploadedFiles = [];
    let cloudMessageDto = {
      userId: userId,
      content: message,
      type: selectedFiles.length === 0 ? "text" : "file",
    };
    try {
      //addCloudMessage in DB
      var result = await dispatch(CreateCloudMessage(cloudMessageDto)).unwrap();
      if (result !== null) {
        let conversationUpdateDto = {
          userId: userId,
          id: id,
          type: type,
          userSend: "Bạn",
          content: message !== "" ? message : "Bạn đã gửi file",
        };
        setMessage("");
        //updateConversation
        var resultUpdateConversation = await dispatch(
          UpdateConversation(conversationUpdateDto)
        ).unwrap();
        if (resultUpdateConversation !== null) {
          if (selectedFiles.length > 0) {
            setUploadProgress(
              selectedFiles.map((file) => ({
                fileName: file.file.name,
                progress: 0,
              }))
            );
            const uploadPromises = selectedFiles.map((file, index) =>
              //uploadFileToCloudinary(file)
              uploadFileToCloudinary(file, (progress) => {
                setUploadProgress((prev) =>
                  prev.map((item, i) =>
                    i === index ? { ...item, progress } : item
                  )
                );
              })
            );
            const uploadedFiles = await Promise.all(uploadPromises);
            const successfulUploads = uploadedFiles.filter(
              (file) => file !== null && file !== undefined
            );
            setSelectedFiles(() => []);
            console.log("File upload thành công:", successfulUploads);
            // Save file upload in DB
            const createFilePromises = successfulUploads.map((file) =>
              dispatch(
                CreateFile({
                  tenFile: file.TenFile,
                  duongDan: file.DuongDan,
                  kichThuocFile: file.KichThuocFile,
                  loaiFile: file.LoaiFile,
                })
              ).unwrap()
            );
            //Save cloudMessageFile
            const createdFiles = await Promise.all(createFilePromises);
            const createCloudMessageFile = createdFiles.map((file) =>
              dispatch(
                AddCloudMessageFile({
                  cloudMessageId: result.cloudMessageId,
                  fileId: file.maFile,
                })
              ).unwrap()
            );
            const convertedList = createdFiles.map((file) => ({
              fileId: file.maFile,
              fileName: file.tenFile,
              fileUrl: file.duongDan,
              typeFile: file.loaiFile,
              sizeFile: file.kichThuocFile,
            }));
            let cloudMessageFile = {
              cloudMessageId: result.cloudMessageId,
              files: convertedList,
            };
            dispatch(addFilesToCloudMessage(cloudMessageFile));
            setTimeout(() => {
              setUploadProgress([]);
            }, 3000);
            console.log(cloudMessageFile);
          }
        }
      } else {
        toast.error("Gửi tin nhắn không thành công");
        console.log(result);
      }
    } catch (ex) {
      console.log(ex);
    }
  };
  const handleSendUserMessage = async () => {
    handleStopTyping(id);
    //userMessageDto
    let userMessageDto = {
      senderId: userId,
      receiverId: id,
      messageType: message.trim() !== "" ? "text" : "file",
      content: message,
    };
    if (userMessageDto !== null) {
      //addUserMessage
      var result = await dispatch(CreateUserMessage(userMessageDto)).unwrap();
      if (result !== null) {
        //updateConversationUser
        await dispatch(
          UpdateConversation({
            userId: userId,
            id: id,
            type: type,
            userSend: "Bạn",
            content: message !== "" ? message : "Bạn đã gửi file",
          })
        );
        setMessage("");
        //updateConversationFriend
        var resultUpdateFriend = await dispatch(
          UpdateConversation({
            userId: id,
            id: userId,
            type: type,
            userSend: userName,
            content: message !== "" ? message : userName + " đã gửi file",
          })
        ).unwrap();
        //sendMessageFriend and updateConversationFriend
        if (connection) {
          console.log("sendMessage");
          await connection.invoke(
            "SendUserMessage",
            id.toString(),
            result,
            resultUpdateFriend
          );
        } else {
          toast.error("Gửi tin nhắn không thành công");
          return;
        }
        //
        if (selectedFiles.length > 0) {
          setUploadProgress(
            selectedFiles.map((file) => ({
              fileName: file.file.name,
              progress: 0,
            }))
          );
          const uploadPromises = selectedFiles.map((file, index) =>
            //uploadFileToCloudinary(file)
            uploadFileToCloudinary(file, (progress) => {
              setUploadProgress((prev) =>
                prev.map((item, i) =>
                  i === index ? { ...item, progress } : item
                )
              );
            })
          );
          const uploadedFiles = await Promise.all(uploadPromises);
          const successfulUploads = uploadedFiles.filter(
            (file) => file !== null && file !== undefined
          );
          setSelectedFiles(() => []);
          console.log(selectedFiles);
          console.log("File upload thành công:", successfulUploads);
          // Save file upload in DB
          const createFilePromises = successfulUploads.map((file) =>
            dispatch(
              CreateFile({
                tenFile: file.TenFile,
                duongDan: file.DuongDan,
                kichThuocFile: file.KichThuocFile,
                loaiFile: file.LoaiFile,
              })
            ).unwrap()
          );
          //Save cloudMessageFile
          const createdFiles = await Promise.all(createFilePromises);
          console.log(result.userMessageId);
          const createUserMessageFile = createdFiles.map((file) =>
            dispatch(
              AddUserMessageFile({
                userMessageId: result.userMessageId,
                fileId: file.maFile,
              })
            ).unwrap()
          );
          console.log(createUserMessageFile);
          const convertedFileList = createdFiles.map((file) => ({
            fileId: file.maFile,
            fileName: file.tenFile,
            fileUrl: file.duongDan,
            typeFile: file.loaiFile,
            sizeFile: file.kichThuocFile,
          }));
          const convertedSendFileList = createdFiles.map((file) => ({
            userId: userId,
            fileId: file.maFile,
            fileName: file.tenFile,
            fileUrl: file.duongDan,
            typeFile: file.loaiFile,
            sizeFile: file.kichThuocFile,
            sentDate: result.createAt,
          }));
          let userMessageFile = {
            userMessageId: result.userMessageId,
            files: convertedFileList,
          };
          console.log(result);
          dispatch(addFilesToUserMessage(userMessageFile));
          if (connection) {
            connection.invoke(
              "SendUserMessageFile",
              userMessageDto.receiverId.toString(),
              userMessageDto.senderId.toString(),
              userMessageFile,
              convertedSendFileList
            );
          }
          setTimeout(() => {
            setUploadProgress([]);
          }, 3000);
          console.log(selectedFiles);
          console.log(convertedSendFileList);
          console.log(userMessageFile);
        }
        //
      } else {
        toast.error("Gửi tin nhắn không thành công");
        return;
      }
    } else {
      toast.error("Vui lòng nhập nội dung tin nhắn");
      return;
    }
  };
  const handleSendGroupMessage = async () => {
    console.log(listGroupUser.groupDetailUsers);
    handleStopTyping(id);
    let groupMessageDto = {
      senderId: userId,
      groupId: id,
      messageType: message.trim() !== "" ? "text" : "file",
      content: message !== "" ? message : "Bạn đã gửi file",
    };
    if (groupMessageDto !== null) {
      var result = await dispatch(AddGroupMessage(groupMessageDto)).unwrap();
      if (result != null) {
        let conversationUpdateGroupDto = {
          id: id,
          type: type,
          userId: userId,
          userSend: "Bạn",
          content: message !== "" ? message : userName + " đã gửi file",
        };
        setMessage("");
        var resultConversationUpdateGroup = await dispatch(
          UpdateConversationGroup(conversationUpdateGroupDto)
        ).unwrap();
        console.log(resultConversationUpdateGroup);
        console.log(listGroupUser.groupDetailUsers);
        if (connection) {
          try {
            //id group, id user gửi tin nhắn trong nhóm
            connection.invoke(
              "SendGroupMessage",
              id.toString(),
              userId.toString(),
              result
            );
            listGroupUser.groupDetailUsers
              .filter((user) => user.userId !== userId)
              .forEach((member) => {
                connection.invoke(
                  "SendConversationGroup",
                  member.userId.toString(),
                  {
                    id: id,
                    type: type,
                    userId: member.userId,
                    userSend: userName,
                    content: message,
                  }
                );
              });
          } catch (error) {
            console.error("Lỗi khi gửi tin nhắn qua SignalR:", error);
            toast.error("Không thể gửi tin nhắn, vui lòng thử lại!");
          }
        }
        //
        if (selectedFiles.length > 0) {
          setUploadProgress(
            selectedFiles.map((file) => ({
              fileName: file.file.name,
              progress: 0,
            }))
          );
          const uploadPromises = selectedFiles.map((file, index) =>
            //uploadFileToCloudinary(file)
            uploadFileToCloudinary(file, (progress) => {
              setUploadProgress((prev) =>
                prev.map((item, i) =>
                  i === index ? { ...item, progress } : item
                )
              );
            })
          );
          const uploadedFiles = await Promise.all(uploadPromises);
          const successfulUploads = uploadedFiles.filter(
            (file) => file !== null && file !== undefined
          );
          if(successfulUploads.length>0){
            setSelectedFiles(() => []);
            console.log(selectedFiles)
          }
          console.log("File upload thành công:", successfulUploads);
          // Save file upload in DB
          const createFilePromises = successfulUploads.map((file) =>
            dispatch(
              CreateFile({
                tenFile: file.TenFile,
                duongDan: file.DuongDan,
                kichThuocFile: file.KichThuocFile,
                loaiFile: file.LoaiFile,
              })
            ).unwrap()
          );
          //Save cloudMessageFile
          const createdFiles = await Promise.all(createFilePromises);
          console.log(result.userMessageId);
          const createGroupMessageFile = createdFiles.map((file) =>
            dispatch(
              AddGroupMessageFile({
                groupedMessageId: result.groupedMessageId,
                fileId: file.maFile,
              })
            ).unwrap()
          );
          console.log(createGroupMessageFile);
          const convertedList = createdFiles.map((file) => ({
            fileId: file.maFile,
            fileName: file.tenFile,
            fileUrl: file.duongDan,
            typeFile: file.loaiFile,
            sizeFile: file.kichThuocFile,
          }));
          const convertedSendFileList = createdFiles.map((file) => ({
            userId: userId,
            fileId: file.maFile,
            fileName: file.tenFile,
            fileUrl: file.duongDan,
            typeFile: file.loaiFile,
            sizeFile: file.kichThuocFile,
            sentDate: result.createAt,
          }));
          let groupMessageFile = {
            groupedMessageId: result.groupedMessageId,
            files: convertedList,
          };
          console.log(result);
          dispatch(addFilesToGroupMessage(groupMessageFile));
          if (connection) {
            connection.invoke(
              "SendGroupMessageFile",
              id.toString(),
              userId.toString(),
              groupMessageFile,
              convertedSendFileList
            );
          }
          setTimeout(() => {
            setUploadProgress([]);
          }, 3000);
          console.log(groupMessageFile);
        }
        //
      }
    } else {
      toast.error("Gửi tin nhắn không thành công");
      return;
    }
  };
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        alert(`File ${file.name} vượt quá giới hạn 25MB!`);
        return false;
      }
      return true;
    });
    const filesWithPreview = validFiles.map((file) => ({
      file,
      preview: imageExtensions.includes(
        file.name.split(".").pop().toLowerCase()
      )
        ? URL.createObjectURL(file)
        : null,
    }));
    setSelectedFiles((prevFiles) => [...prevFiles, ...filesWithPreview]);
    console.log(selectedFiles);
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
  const uploadFileToCloudinary = async (file, onProgress) => {
    var fileDetail = file.file;
    const formData = new FormData();
    formData.append("file", fileDetail);
    const fileInfo = {
      TenFile: fileDetail.name,
      KichThuocFile: formatFileSize(fileDetail.size),
      LoaiFile: fileDetail.name.split(".").pop(),
    };
    try {
      const response = await axios.post(
        `${config.API_URL}/File/Upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              onProgress(percent);
            }
          },
        }
      );
      return {
        ...fileInfo,
        DuongDan: response.data.url,
      };
    } catch (error) {
      console.error("Lỗi upload file:", error);
      return null;
    }
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
  const handleTypingUser = (id) => {
    if (connection) {
      try {
        if (userName !== null && userName !== undefined) {
          if (type === "user") {
            connection.invoke(
              "HoverSendUserMessage",
              id.toString(),
              userName + " đang soạn tin"
            );
          } else {
            connection.invoke(
              "HoverSendGroupMessage",
              id.toString(),
              userId.toString(),
              userName + " đang soạn tin"
            );
          }
        }
      } catch (error) {
        console.error("Lỗi khi gửi tin nhắn qua SignalR:", error);
        toast.error("Không thể gửi tin nhắn, vui lòng thử lại!");
      }
    }
  };
  const handleStopTyping = (id) => {
    if (connection) {
      try {
        if (type === "user") {
          connection.invoke("HoverSendUserMessage", id.toString(), null);
        } else {
          connection.invoke(
            "HoverSendGroupMessage",
            id.toString(),
            userId.toString(),
            null
          );
        }
      } catch (error) {
        console.error("Lỗi khi gửi tín hiệu dừng gõ:", error);
      }
    }
  };
  return (
    <div
      className="p-4 bg-gray-200 flex flex-col sticky bottom-0 w-full"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {type === "user"
        ? typingUser && (
            <p className="absolute -top-6 left-4 bg-white px-2 py-1 rounded shadow text-gray-600 text-xs">
              {typingUser} ...
            </p>
          )
        : typingGroup && (
            <p className="absolute -top-6 left-4 bg-white px-2 py-1 rounded shadow text-gray-600 text-xs">
              {typingGroup} ...
            </p>
          )}
      <div className="relative flex items-center w-full">
        <textarea
          value={message}
          onChange={(e) => {
            const newMessage = e.target.value;
            if (newMessage.trim() !== "" && newMessage !== message.trim()) {
              handleTypingUser(id);
            } else {
              handleStopTyping(id);
            }
            setMessage(newMessage);

            // CẬP NHẬT: Tự động điều chỉnh chiều cao textarea
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          className="flex-1 p-2 rounded bg-white outline-none border border-transparent 
               focus:ring-0 focus:border-transparent resize-none overflow-hidden
               max-h-40 min-h-[40px]"
          placeholder={`Nhập @, tin nhắn tới ${conversationName}`}
          rows={1} // CẬP NHẬT: Đặt số dòng tối thiểu ban đầu
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
          {/* <i className="fas fa-microphone"></i>
          <i className="fas fa-ellipsis-v"></i> */}
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
      {uploadProgress.length > 0 && (
        <div className="fixed top-5 right-5 bg-white p-4 rounded-lg shadow-lg w-80">
          <h4 className="text-lg font-semibold mb-2 text-gray-700">
            Đang gửi file...
          </h4>
          {uploadProgress.map(({ fileName, progress }) => (
            <div key={fileName} className="mb-3">
              <span className="block text-sm font-medium text-gray-600">
                {fileName}
              </span>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-500 h-2.5 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="block text-sm text-gray-500 mt-1">
                {progress}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectMethod;
