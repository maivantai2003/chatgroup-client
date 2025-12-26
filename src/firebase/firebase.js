import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDmZfHkfx2rQK_rs38LkkAlATJOM6vApHs",
  authDomain: "dotnetauth-436708.firebaseapp.com",
  projectId: "dotnetauth-436708",
  storageBucket: "dotnetauth-436708.firebasestorage.app",
  messagingSenderId: "147037673556",
  appId: "1:147037673556:web:2b7542cb5b402af168f5c1",
  measurementId: "G-R34QBYYQ25"
};


const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// 🔹 Xin quyền & lấy token
export const requestPermissionAndGetToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission not granted!");
      return null;
    }
    const token = await getToken(messaging, {
      vapidKey: "BDQqZ91c5SXl5zBhHae-7G141KchJv6M5wr2OehJfOv6tS3knDhBfBms0eOMM4T6nrr067ZH4UT2N_XVI9n3ndo",
    });
    console.log("FCM Token:", token);
    return token;
  } catch (error) {
    console.error("Lỗi khi lấy token FCM", error);
    return null;
  }
};

// 🔹 Lắng nghe khi app đang foreground
export const listenForegroundMessage = (navigate) => {
  onMessage(messaging, (payload) => {
    console.log("Foreground message:", payload);
    // new Notification(payload.notification.title, {
    //   body: payload.notification.body,
    //   icon: "/logo192.png",
    // });
    const data = payload.data;
    if (!data) return;

    handleAction(data, navigate);
  });
};
const handleAction = (data, navigate) => {
  switch (data.action) {
    case "open_chat":
      navigate(`/chat/${data.chatId}`);
      break;

    case "open_profile":
      navigate(`/profile`);
      break;

    case "system_notice":
      navigate(`/notifications`);
      break;
  }
}
