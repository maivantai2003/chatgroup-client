import { useState, useEffect } from "react";
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

const formatSize = (size) => {
  if (!size) return "N/A";
  const bytes = parseInt(size, 10);
  if (isNaN(bytes)) return "N/A";

  const sizes = ["B", "KB", "MB", "GB", "TB"];
  let order = 0;
  let formattedSize = bytes;

  while (formattedSize >= 1024 && order < sizes.length - 1) {
    order++;
    formattedSize /= 1024;
  }

  return `${formattedSize.toFixed(2)} ${sizes[order]}`;
};

const isImage = (file) =>
  ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"].includes(
    file.typeFile.toLowerCase()
  );

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

const FileMessage = ({ file }) => {
  const [preview, setPreview] = useState("");
  useEffect(() => {
    if (file.typeFile.toLowerCase() === "txt") {
      fetch(file.fileUrl)
        .then((res) => res.text())
        .then((text) => {
          const lines = text.split("\n").slice(0, 5).join("\n");
          setPreview(lines);
        })
        .catch(() => setPreview("Không thể đọc file"));
    }
  }, [file.fileUrl, file.typeFile]);

  return (
    <div className="flex flex-col border p-2 rounded mb-2 bg-gray-50">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center flex-1 overflow-hidden">
          {isImage(file) ? (
            <img
              src={file.fileUrl}
              alt={file.fileName}
              className="w-10 h-10 object-cover rounded mr-3"
            />
          ) : (
            getFileIcon(file.typeFile)
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{file.fileName}</p>
            <p className="text-xs text-gray-500">{file.sizeFile}</p>
          </div>
        </div>
        <a href={file.fileUrl} download className="text-blue-500 text-lg p-2">
          <FaDownload />
        </a>
      </div>
      {file.typeFile.toLowerCase() === "txt" && (
        <pre className="text-xs text-gray-700 bg-white p-2 rounded overflow-x-auto">
          {preview}
        </pre>
      )}
    </div>
  );
};

export default FileMessage;
