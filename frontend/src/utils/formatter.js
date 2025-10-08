import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isYesterday);

export const formatChatTime = (timestamp) => {
  const date = dayjs(timestamp);

  if (date.isToday()) {
    return date.format("hh:mm A"); // only time for today
  } else if (date.isYesterday()) {
    return `Yesterday`;
  } else {
    return date.format("DD MMM YYYY");
  }
};
