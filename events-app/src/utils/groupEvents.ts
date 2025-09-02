import dayjs from "../lib/dayjs";
import { type Event } from "../types/Event";

export type Grouped = {
  weekStart?: string;
  weekEnd?: string;
  date: string;
  events: Event[];
};

export function groupEventsByDay(events: Event[]): Grouped[] {
  const map = new Map<string, Event[]>();

  for (const event of events) {
    const timezone = dayjs.tz.guess();

    const key = dayjs(event.start).tz(timezone).format("YYYY-MM-DD");

    const list = map.get(key) ?? [];
    list.push(event);
    map.set(key, list);
  }

  const groups: Grouped[] = Array.from(map, ([date, list]) => ({
    date,
    events: list.sort(
      (a, b) =>
        dayjs(a.start).tz(dayjs.tz.guess()).valueOf() -
        dayjs(b.start).tz(dayjs.tz.guess()).valueOf()
    ),
  }));

  groups.sort(
    (a, b) =>
      dayjs(a.date).tz(dayjs.tz.guess()).valueOf() -
      dayjs(b.date).tz(dayjs.tz.guess()).valueOf()
  );

  return groups;
}

export function groupEventsByWeek(events: Event[]): Grouped[] {
  const userTz = dayjs.tz.guess();
  const map = new Map<string, Event[]>();

  for (const event of events) {
    const d = dayjs(event.start).tz(userTz);

    const startOfWeek = d.startOf("week");
    const key = startOfWeek.format("YYYY-MM-DD");

    const list = map.get(key) ?? [];
    list.push(event);
    map.set(key, list);
  }

  const groups: Grouped[] = Array.from(map, ([weekStart, list]) => {
    const weekEnd = dayjs(weekStart).add(6, "day").format("YYYY-MM-DD");
    return {
      weekStart,
      weekEnd,
      date: `${weekStart} - ${weekEnd}`,
      events: list.sort(
        (a, b) =>
          dayjs(a.start).tz(userTz).valueOf() -
          dayjs(b.start).tz(userTz).valueOf()
      ),
    };
  });

  groups.sort(
    (a, b) =>
      dayjs(a.weekStart).tz(userTz).valueOf() -
      dayjs(b.weekStart).tz(userTz).valueOf()
  );

  return groups;
}
