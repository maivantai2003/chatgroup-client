export const getTimeAgo = (sentTime) => {
    if (!sentTime) return "Vừa xong";
    const time = new Date(sentTime).getTime();
    const now = new Date().getTime();
    if (time > now) return "Vừa xong"; 
    const diff = Math.floor((now - time) / 1000);
    if (diff < 60) return `${diff} giây trước`;
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)} ngày trước`;
    if (diff < 31536000) return `${Math.floor(diff / 2592000)} tháng trước`;
    return `${Math.floor(diff / 31536000)} năm trước`;
};