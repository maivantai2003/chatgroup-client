import { formatMessageDate } from "./formatMessageDate";

export const groupMessagesByDate = (messages) => {
    return messages.reduce((acc, message) => {
      const dateLabel = formatMessageDate(message.createAt);
      if (!acc[dateLabel]) {
        acc[dateLabel] = [];
      }
      acc[dateLabel].push(message);
      return acc;
    }, {});
  };