import React, { useState } from "react";
import {
  FaDownload,
  FaRegFilePdf,
  FaRegFileWord,
  FaRegFileExcel,
  FaRegFilePowerpoint,
  FaRegFileAlt,
  FaRegFileArchive,
  FaRegFileAudio,
  FaRegFileVideo,
  FaRegFileImage,
} from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import { getTimeAgo } from "../helpers/convertTime";

const isImage = (file) => {
  return ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"].includes(
    file.typeFile.toLowerCase()
  );
};

const isVideo = (file) => {
  return ["mp4", "avi", "mkv", "mov", "wmv"].includes(
    file.typeFile.toLowerCase()
  );
};

const getFileIcon = (fileType) => {
  switch (fileType.toLowerCase()) {
    case "pdf":
      return <FaRegFilePdf className="text-red-500 text-3xl mr-3" />;
    case "doc":
    case "docx":
      return <FaRegFileWord className="text-blue-500 text-3xl mr-3" />;
    case "xls":
    case "xlsx":
      return <FaRegFileExcel className="text-green-500 text-3xl mr-3" />;
    case "ppt":
    case "pptx":
      return <FaRegFilePowerpoint className="text-orange-500 text-3xl mr-3" />;
    case "zip":
    case "rar":
    case "7z":
      return <FaRegFileArchive className="text-purple-500 text-3xl mr-3" />;
    case "mp3":
    case "wav":
    case "flac":
      return <FaRegFileAudio className="text-yellow-500 text-3xl mr-3" />;
    case "mp4":
    case "avi":
    case "mkv":
      return <FaRegFileVideo className="text-indigo-500 text-3xl mr-3" />;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "svg":
    case "webp":
      return <FaRegFileImage className="text-teal-500 text-3xl mr-3" />;
    case "zalo":
      return <SiZalo className="text-blue-500 text-3xl mr-3" />;
    default:
      return <FaRegFileAlt className="text-gray-500 text-3xl mr-3" />;
  }
};

const FileItem = ({ file }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition cursor-pointer w-full mb-2 group relative">
      {/* Hiển thị ảnh hoặc video */}
      <div className="flex items-center w-[85%]">
        {isImage(file) ? (
          <img
            src={file.fileUrl}
            alt={file.fileName}
            className="w-10 h-10 object-cover rounded mr-3"
          />
        ) : isVideo(file) ? (
          <div className="relative w-32 h-20">
            {!isPlaying ? (
              <div
                className="w-full h-full bg-gray-300 flex items-center justify-center cursor-pointer"
                onClick={() => setIsPlaying(true)}
              >
                <video
                  className="absolute top-0 left-0 w-full h-full object-cover rounded"
                  src={file.fileUrl}
                  poster="../assets/images/default-video-thumbnail.png"
                ></video>
                <button className="absolute w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  ▶
                </button>
              </div>
            ) : (
              <video
                className="w-32 h-20 object-cover rounded"
                src={file.fileUrl}
                controls
                autoPlay
              ></video>
            )}
          </div>
        ) : (
          getFileIcon(file.typeFile)
        )}

        {/* Thông tin file */}
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-gray-800 truncate w-44">
            {file.fileName}
          </p>
          <div className="flex justify-between items-center text-xs text-gray-500 w-full">
            <p className="truncate">{file.sizeFile}</p>
            <p className="ml-auto text-right">{getTimeAgo(file.sentDate)}</p>
          </div>
        </div>
      </div>

      {/* Nút tải file */}
      <a
        href={file.fileUrl}
        download
        className="text-blue-500 text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute top-2 right-3"
      >
        <FaDownload />
      </a>
    </div>
  );
};

export default FileItem;
