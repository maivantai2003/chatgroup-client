export const formatTime = (dateTime) => {
    if (!dateTime) return "";
    return new Date(dateTime).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };
  