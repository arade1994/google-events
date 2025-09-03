import { useCallback, useState } from "react";
import styles from "./CreateEventForm.module.scss";
import { useCreateEvent } from "../../hooks/useCreateEvent";
import dayjs from "dayjs";

export default function CreateEventForm({ onClose }: { onClose: () => void }) {
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [errors, setErrors] = useState({
    eventName: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
  });

  const { createEvent } = useCreateEvent();

  const handleCreateEvent = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const newErrors = {
        eventName: eventName ? "" : "Event name is required",
        description: description ? "" : "Description is required",
        date: date ? "" : "Date is required",
        startTime: startTime ? "" : "Start time is required",
        endTime: endTime ? "" : "End time is required",
      };

      if (Object.values(newErrors).some((error) => error)) {
        setErrors(newErrors);
        return;
      }

      createEvent(
        {
          name: eventName,
          description,
          startTime: dayjs(`${date}T${startTime}:00`).toISOString(),
          endTime: dayjs(`${date}T${endTime}:00`).toISOString(),
        },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    },
    [eventName, description, date, startTime, endTime, createEvent, onClose]
  );

  return (
    <>
      <h2 className={styles.title}>Create New Event</h2>
      <form className={styles.form} onSubmit={handleCreateEvent}>
        <div className={styles.formRow}>
          <label htmlFor="eventName" className={styles.label}>
            Event Name
          </label>
          <input
            type="text"
            id="eventName"
            value={eventName}
            onChange={(e) => {
              setEventName(e.target.value);
              setErrors((prev) => ({ ...prev, eventName: "" }));
            }}
            className={styles.input}
          />
          {errors.eventName && (
            <p className={styles.error}>{errors.eventName}</p>
          )}
        </div>
        <div className={styles.formRow}>
          <label htmlFor="description" className={styles.label}>
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setErrors((prev) => ({ ...prev, description: "" }));
            }}
            className={styles.input}
          />
          {errors.description && (
            <p className={styles.error}>{errors.description}</p>
          )}
        </div>
        <div className={styles.formRow}>
          <label htmlFor="date" className={styles.label}>
            Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setErrors((prev) => ({ ...prev, date: "" }));
            }}
            className={styles.input}
          />
          {errors.date && <p className={styles.error}>{errors.date}</p>}
        </div>
        <div className={styles.formRow}>
          <label htmlFor="startTime" className={styles.label}>
            Start Time
          </label>
          <input
            type="time"
            id="startTime"
            value={startTime}
            onChange={(e) => {
              setStartTime(e.target.value);
              setErrors((prev) => ({ ...prev, startTime: "" }));
            }}
            className={styles.input}
          />
          {errors.startTime && (
            <p className={styles.error}>{errors.startTime}</p>
          )}
        </div>
        <div className={styles.formRow}>
          <label htmlFor="endTime" className={styles.label}>
            End Time
          </label>
          <input
            type="time"
            id="endTime"
            value={endTime}
            onChange={(e) => {
              setEndTime(e.target.value);
              setErrors((prev) => ({ ...prev, endTime: "" }));
            }}
            className={styles.input}
          />
          {errors.endTime && <p className={styles.error}>{errors.endTime}</p>}
        </div>
        <button className={styles.button}>Create Event</button>
      </form>
    </>
  );
}
