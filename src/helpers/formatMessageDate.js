import { format, isToday, isYesterday } from "date-fns";

export const formatMessageDate = (dateString) => {
  const date = new Date(dateString);
  if (isToday(date)) return "Hôm nay";
  if (isYesterday(date)) return "Hôm qua";
  return format(date, "dd/MM/yyyy");
};
