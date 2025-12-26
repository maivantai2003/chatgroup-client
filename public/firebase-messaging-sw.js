/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.11/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyDmZfHkfx2rQK_rs38LkkAlATJOM6vApHs",
  authDomain: "dotnetauth-436708.firebaseapp.com",
  projectId: "dotnetauth-436708",
  storageBucket: "dotnetauth-436708.firebasestorage.app",
  messagingSenderId: "147037673556",
  appId: "1:147037673556:web:2b7542cb5b402af168f5c1",
  measurementId: "G-R34QBYYQ25"
};
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message:", payload);
  const data = payload.data || {};
  // const notificationTitle = payload.notification?.title || "Thông báo mới";
  // const notificationOptions = {
  //   body: payload.notification?.body,
  //   icon: "/logo192.png",
  // };

  // self.registration.showNotification(notificationTitle, notificationOptions);
  self.registration.showNotification(
    data.title || "Thông báo",
    {
      body: data.body,
      data: data,
      icon: "/src/assets/images/noti.png"
    }
  );
});
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const data = event.notification.data;
  let url = "/";
  if (data.action === "open_chat") {
    url = `/chat/${data.chatId}`;
  }
  if (data.action === "system_notice") {
    url = "/notifications";
  }
  event.waitUntil(
    clients.openWindow(url)
  );
});