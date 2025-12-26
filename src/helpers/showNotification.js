export const showNotification = (title, body) => {
  if (Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: "/logo192.png", // icon của bạn
    });
  }
};