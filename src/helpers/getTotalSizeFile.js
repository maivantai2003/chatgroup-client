export const getTotalSizeFile = (listCloudMessageFile) => {
    const getSizeMB = (bytes) => bytes / (1024 * 1024);
    const totalSizeMB = listCloudMessageFile.reduce((sum, file) => sum + getSizeMB(file.size), 0);
    const maxSizeMB = 1024;
    const sizeByType = {
    image: 0,
    video: 0,
    file: 0,
    other: 0,
    };
    listCloudMessageFile.forEach((file) => {
    const ext = file.typeFile.toLowerCase();
    const sizeMB = getSizeMB(file.size);
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) {
        sizeByType.image += sizeMB;
    } else if (["mp4", "mov", "avi"].includes(ext)) {
        sizeByType.video += sizeMB;
    } else if (["pdf", "doc", "docx", "xls", "xlsx", "zip", "rar"].includes(ext)) {
        sizeByType.file += sizeMB;
    } else {
        sizeByType.other += sizeMB;
    }
    });

}