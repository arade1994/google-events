import { useMemo } from "react";
import { useFetchEvents } from "../../hooks/useFetchEvents";
import { useSearchParams } from "react-router";
import Spinner from "../common/Spinner";
import { groupEventsByDay, groupEventsByWeek } from "../../utils/groupEvents";
import dayjs from "../../lib/dayjs";
import styles from "./EventsTable.module.scss";
import { formatDayTime, formatTime } from "../../utils/dateTime";

export default function EventsTable() {
  const [searchParams] = useSearchParams();
  const { events, isFetchingEvents } = useFetchEvents();

  const filterDays = Number(searchParams.get("filterDays")) || 7;

  const groupedEvents = useMemo(
    () =>
      filterDays === 30
        ? groupEventsByWeek(events || [])
        : groupEventsByDay(events || []),
    [events, filterDays]
  );

  if (isFetchingEvents) return <Spinner />;

  return groupedEvents.length === 0 ? (
    <p>No events found. Try syncing with your Google Calendar.</p>
  ) : (
    groupedEvents.map((group) => (
      <div key={group.date} className={styles.dayGroup}>
        {filterDays !== 30 ? (
          <h2>{dayjs(group.date).format("dddd, MMMM D, YYYY")}</h2>
        ) : (
          <h2>
            {dayjs(group.weekStart).format("dddd, MMMM D, YYYY")} -{" "}
            {dayjs(group.weekEnd).format("dddd, MMMM D, YYYY")}
          </h2>
        )}
        <table className={styles.eventsTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Start</th>
              <th>End</th>
            </tr>
          </thead>
          <tbody>
            {group.events.map((event) => (
              <tr key={event.id}>
                <td>{event.name}</td>
                <td>
                  {filterDays === 30
                    ? formatDayTime(event.start)
                    : formatTime(event.start)}
                </td>
                <td>
                  {filterDays === 30
                    ? formatDayTime(event.end)
                    : formatTime(event.end)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ))
  );
}
