export const normalizeDateTime = (input) => {
  if (!input) return null;

  const pad = (n) => n.toString().padStart(2, "0");

  // If input is already datetime-local format (YYYY-MM-DDTHH:mm)
  // -> RETURN AS IS (prevents UTC conversion issues)
  const datetimeLocalPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
  if (datetimeLocalPattern.test(input)) {
    return input;
  }

  // If input is only time like "19.07" or "7.07"
  const timePattern = /^(\d{1,2})[.:](\d{1,2})$/;
  const timeMatch = input.match(timePattern);
  if (timeMatch) {
    const hours = parseInt(timeMatch[1]);
    const minutes = parseInt(timeMatch[2]);

    const today = new Date();
    today.setHours(hours, minutes, 0, 0);

    return `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}T${pad(today.getHours())}:${pad(today.getMinutes())}`;
  }

  // Handle other date/time formats (like ISO)
  let d = new Date(input);
  if (isNaN(d.getTime())) return null;

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
