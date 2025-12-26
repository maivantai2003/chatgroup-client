const urlRegex = /(https?:\/\/[^\s]+)/g;

export const extractUrlFromMessage = (text) => {
  const urls = text.match(urlRegex);
  return urls ? urls[0] : null;
};
