import styles from "./Events.module.scss";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getEvents, syncEvents } from "../services/api";
import { groupByDay, groupByWeek } from "../utils/groupEvents";
import Spinner from "../components/Spinner";
import dayjs from "../lib/dayjs";
import { useMemo, useState } from "react";

function formatTime(date: string) {
  const userTz = dayjs.tz.guess();

  return dayjs(date).tz(userTz).format("HH:mm");
}

function formatDayTime(date: string) {
  const userTz = dayjs.tz.guess();
  return dayjs(date).tz(userTz).format("ddd, MMM D, HH:mm");
}

export default function Events() {
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const [filterDays, setFilterDays] = useState(7);

  const { data: events, isLoading: isFetchingEvents } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
    placeholderData: [],
  });

  const { mutate: triggerSync, isPending: isSyncing } = useMutation({
    mutationFn: syncEvents,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Events synced");
    },
    onError: () => {
      toast.error("Failed to sync events");
    },
  });

  const filteredEvents = useMemo(() => {
    if (!events) {
      return [];
    }
    const today = dayjs().startOf("day");
    const futureDate = today.add(filterDays, "day").endOf("day");

    return events.filter((event) => {
      const eventDate = dayjs(event.start);
      return (
        eventDate.isAfter(today.subtract(1, "day")) &&
        eventDate.isBefore(futureDate)
      );
    });
  }, [events, filterDays]);

  const groupedEvents = useMemo(
    () =>
      filterDays === 30
        ? groupByWeek(filteredEvents)
        : groupByDay(filteredEvents),
    [filteredEvents, filterDays]
  );

  if (isFetchingEvents || isSyncing) return <Spinner />;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Events</h1>
        <div className={styles.actions}>
          <button onClick={() => triggerSync()} disabled={isSyncing}>
            {isSyncing ? "Syncing..." : "Sync events"}
          </button>
          <button onClick={logout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>

      <div className={styles.filterContainer}>
        <button
          className={`${styles.filterButton} ${
            filterDays === 1 ? styles.active : ""
          }`}
          onClick={() => setFilterDays(1)}
        >
          Next Day
        </button>
        <button
          className={`${styles.filterButton} ${
            filterDays === 7 ? styles.active : ""
          }`}
          onClick={() => setFilterDays(3)}
        >
          Next 7 Days
        </button>
        <button
          className={`${styles.filterButton} ${
            filterDays === 30 ? styles.active : ""
          }`}
          onClick={() => setFilterDays(30)}
        >
          Next 30 Days
        </button>
      </div>

      {groupedEvents.length === 0 ? (
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
      )}
    </div>
  );
}
