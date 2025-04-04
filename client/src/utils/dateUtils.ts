export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);

  const formattedDate = date.toLocaleDateString([], {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });

  const formattedTime = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${formattedDate} ${formattedTime}`;
};
