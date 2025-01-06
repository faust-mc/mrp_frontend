export const formatDate = (dateString) => {
  // Create a Date object from the ISO string
  const date = new Date(dateString);

  // Ensure the date is valid
  if (isNaN(date)) {
    throw new Error("Invalid ISO date string format. Expected YYYY-MM-DDTHH:mm:ssZ.");
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
