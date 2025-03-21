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
import { SiZalo } from "react-icons/si"; // Icon Zalo (nếu có)

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

// Kiểm tra xem file có phải là hình ảnh
const isImage = (file) => {
  return ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"].includes(
    file.typeFile.toLowerCase()
  );
};

// Chọn icon phù hợp với loại file
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
  return (
    <div className="bg-blue-100 p-3 rounded-lg flex items-center justify-between w-80 mb-2">
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
  );
};

export default FileMessage;
