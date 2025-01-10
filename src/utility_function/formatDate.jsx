export const formatDate = (dateString) => {

  const date = new Date(dateString);
  if (isNaN(date)) {
    return `-`;
  }

  // Format the date part
  const dateOptions = { year: "numeric", month: "short", day: "numeric" };
  const formattedDate = date.toLocaleDateString(undefined, dateOptions);

  // Format the time part
  const timeOptions = { hour: "numeric", minute: "numeric", second: "numeric", hour12: true };
  const formattedTime = date.toLocaleTimeString(undefined, timeOptions);

  // Combine and return the formatted date and time
  return `${formattedDate}, ${formattedTime}`;
};
