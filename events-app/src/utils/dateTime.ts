import dayjs from "../lib/dayjs";

export function formatTime(date: string) {
  const userTz = dayjs.tz.guess();

  return dayjs(date).tz(userTz).format("HH:mm");
}

export function formatDayTime(date: string) {
  const userTz = dayjs.tz.guess();
  return dayjs(date).tz(userTz).format("ddd, MMM D, HH:mm");
}
