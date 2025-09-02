import styles from "./Events.module.scss";
import Header from "../components/common/Header";
import EventFilters from "../components/events/EventsFilters";
import EventsTable from "../components/events/EventsTable";

export default function Events() {
  return (
    <div className={styles.eventsContainer}>
      <Header />
      <EventFilters />
      <EventsTable />
    </div>
  );
}
