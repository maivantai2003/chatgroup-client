import { useState, useEffect } from "react";
import {
  File as FileIcon,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileSpreadsheet,
  FileCode,
  FilePlus2,
  Download,
} from "lucide-react";

import { SiZalo } from "react-icons/si";

const isImage = (file) =>
  ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"].includes(
    file.typeFile.toLowerCase()
  );

const getFileIcon = (fileType) => {
  switch (fileType.toLowerCase()) {
    case "pdf":
      return <FileText className="w-10 h-10 text-red-500" />;
    case "doc":
    case "docx":
      return <FileText className="w-10 h-10 text-blue-500" />;
    case "xls":
    case "xlsx":
      return <FileSpreadsheet className="w-10 h-10 text-green-500" />;
    case "ppt":
    case "pptx":
      return <FilePlus2 className="w-10 h-10 text-orange-500" />;
    case "zip":
    case "rar":
    case "7z":
      return <FileArchive className="w-10 h-10 text-purple-500" />;
    case "mp3":
    case "wav":
    case "flac":
      return <FileAudio className="w-10 h-10 text-yellow-500" />;
    case "mp4":
    case "avi":
    case "mkv":
      return <FileVideo className="w-10 h-10 text-indigo-500" />;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "svg":
    case "webp":
      return <FileImage className="w-10 h-10 text-teal-500" />;
    case "txt":
      return <FileCode className="w-10 h-10 text-gray-500" />;
    default:
      return <FileIcon className="w-10 h-10 text-gray-400" />;
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
    <div className="flex flex-col bg-white rounded-lg shadow-sm p-3 w-64">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 w-5/6">
          {isImage(file) ? (
            <img
              src={file.fileUrl}
              alt={file.fileName}
              className="w-12 h-12 object-cover rounded-md"
            />
          ) : (
            getFileIcon(file.typeFile)
          )}
          <div className="flex flex-col overflow-hidden">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {file.fileName}
            </p>
            <p className="text-xs text-gray-500">{file.sizeFile}</p>
          </div>
        </div>
        <a
          href={file.fileUrl}
          download
          className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
          title="Tải xuống"
          target="_blank"
        >
          <Download className="w-5 h-5" />
        </a>
      </div>

      {/* Preview cho txt */}
      {file.typeFile.toLowerCase() === "txt" && (
        <pre className="mt-2 text-xs text-gray-700 bg-gray-100 p-2 rounded-md overflow-x-auto max-h-24 whitespace-pre-wrap font-mono">
          {preview}
        </pre>
      )}
    </div>
  );
};

export default FileMessage;
