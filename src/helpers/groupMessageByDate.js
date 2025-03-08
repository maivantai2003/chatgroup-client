import { format } from "date-fns";
import vi from "date-fns/locale/vi";

export const groupMessagesByDate = (messages) => {
  const groupedMessages = {};

  messages.forEach((msg) => {
    const messageDate = new Date(msg.createAt);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    let formattedDate;
    if (messageDate.toDateString() === today.toDateString()) {
      formattedDate = "Hôm nay";
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      formattedDate = "Hôm qua";
    } else {
      formattedDate = format(messageDate, "dd/MM/yyyy", { locale: vi });
    }

    if (!groupedMessages[formattedDate]) {
      groupedMessages[formattedDate] = [];
    }
    groupedMessages[formattedDate].push(msg);
  });

  return groupedMessages;
};
