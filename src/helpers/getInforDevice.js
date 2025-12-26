export const getOS = () => {
  const userAgent = navigator.userAgent;
  if (userAgent.indexOf("Win") !== -1) return "Windows";
  if (userAgent.indexOf("Mac") !== -1) return "MacOS";
  if (userAgent.indexOf("Linux") !== -1) return "Linux";
  if (userAgent.indexOf("Android") !== -1) return "Android";
  if (userAgent.indexOf("like Mac") !== -1) return "iOS";
  return "Unknown";
};
export const getDeviceName = () => {
  const ua = navigator.userAgent;
  if (/Mobile|Android|iPhone|iPad/.test(ua)) return "Mobile Device";
  if (/Macintosh|Windows/.test(ua)) return "Desktop/Laptop";
  return "Unknown Device";
};

