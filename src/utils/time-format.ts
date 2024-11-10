const convertSeconds = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const hourString = hours > 0 ? `${hours} hour${hours > 1 ? "s" : ""}` : "";
  const minuteString =
    minutes > 0 ? `${minutes} minute${minutes > 1 ? "s" : ""}` : "";
  const secondString =
    remainingSeconds > 0
      ? `${remainingSeconds} second${remainingSeconds > 1 ? "s" : ""}`
      : "";

  if (hours > 0) {
    return `${hourString} and ${minuteString || "0 minute"} ${
      secondString && `and ${secondString}`
    }`;
  } else if (!hours && minutes > 0) {
    return `${minuteString} ${secondString && `and ${secondString}`}`;
  }

  return secondString;
};

export default convertSeconds;
