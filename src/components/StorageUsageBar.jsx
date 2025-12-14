// Chuyển đổi chuỗi sizeFile như "66.35 KB" hoặc "1.2 MB" thành số MB
const parseSizeToMB = (sizeString) => {
  if (!sizeString) return 0;
  const [value, unit] = sizeString.split(" ");
  const num = parseFloat(value.replace(",", "."));
  if (unit === "KB") return num / 1024;
  if (unit === "MB") return num;
  if (unit === "GB") return num * 1024;
  return 0;
};

const StorageUsageBar = ({ files, maxSizeMB = 1024 }) => {
  const totalSizeMB = files.reduce(
    (sum, file) => sum + parseSizeToMB(file.sizeFile),
    0
  );

  const sizeByType = {
    image: 0,
    video: 0,
    file: 0,
    other: 0,
  };
  console.log(sizeByType);
  files.forEach((file) => {
    const ext = file.typeFile.toLowerCase();
    console.log(ext);
    const sizeMB = parseSizeToMB(file.sizeFile);

    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) {
      sizeByType.image += sizeMB;
    } else if (["mp4", "mov", "avi"].includes(ext)) {
      sizeByType.video += sizeMB;
    } else if (
      ["pdf", "doc", "docx", "xls", "xlsx", "zip", "rar"].includes(ext)
    ) {
      sizeByType.file += sizeMB;
    } else {
      sizeByType.other += sizeMB;
    }
  });

  return (
    <div className="mt-6">
      <div className="font-bold mb-1">Dung lượng đã dùng</div>
      <div className="text-sm text-gray-600 mb-2">
        {totalSizeMB.toFixed(1)} MB / {maxSizeMB} MB
      </div>
      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden flex">
        <div
          className="bg-orange-500"
          style={{ width: `${(sizeByType.image / maxSizeMB) * 100}%` }}
          title={`Ảnh: ${sizeByType.image.toFixed(1)} MB`}
        />
        <div
          className="bg-green-500"
          style={{ width: `${(sizeByType.video / maxSizeMB) * 100}%` }}
          title={`Video: ${sizeByType.video.toFixed(1)} MB`}
        />
        <div
          className="bg-yellow-500"
          style={{ width: `${(sizeByType.file / maxSizeMB) * 100}%` }}
          title={`File: ${sizeByType.file.toFixed(1)} MB`}
        />
        <div
          className="bg-gray-500"
          style={{ width: `${(sizeByType.other / maxSizeMB) * 100}%` }}
          title={`Khác: ${sizeByType.other.toFixed(1)} MB`}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <div className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-orange-500 inline-block"></span>
          <span>Ảnh</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
          <span>Video</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block"></span>
          <span>File</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-gray-500 inline-block"></span>
          <span>Khác</span>
        </div>
      </div>
    </div>
  );
};

export default StorageUsageBar;
