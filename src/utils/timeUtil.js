export const combineDateAndTime = (selectedDate, timeStr) => {
  

  const [hours, minutes] = timeStr.split(":").map(Number);

  const newDate = new Date(selectedDate);
  newDate.setHours(hours);
  newDate.setMinutes(minutes);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);

  return newDate;
};
