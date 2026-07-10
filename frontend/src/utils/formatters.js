export function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(value || 0);
}

export function formatShowDate(dateValue) {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(`${dateValue}T00:00:00`));
}

export function formatShowTime(timeValue) {
  return timeValue;
}

export function getShowtimeDate(showtime) {
  return new Date(`${showtime.date}T${showtime.time}:00`);
}

export function isPastShowtime(showtime) {
  return getShowtimeDate(showtime).getTime() < Date.now();
}
