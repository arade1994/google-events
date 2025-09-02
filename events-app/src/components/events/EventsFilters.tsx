import { useCallback } from "react";
import { useSearchParams } from "react-router";
import styles from "./EventsFilters.module.scss";

export default function EventFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSetFilterDays = useCallback(
    (days: number) => {
      searchParams.set("filterDays", days.toString());
      setSearchParams(searchParams);
    },
    [searchParams, setSearchParams]
  );

  const filterDays = Number(searchParams.get("filterDays")) || 7;

  return (
    <div className={styles.filterContainer}>
      <button
        className={`${styles.filterButton} ${
          filterDays === 1 ? styles.active : ""
        }`}
        onClick={() => handleSetFilterDays(1)}
      >
        Next Day
      </button>
      <button
        className={`${styles.filterButton} ${
          filterDays === 7 ? styles.active : ""
        }`}
        onClick={() => handleSetFilterDays(7)}
      >
        Next 7 Days
      </button>
      <button
        className={`${styles.filterButton} ${
          filterDays === 30 ? styles.active : ""
        }`}
        onClick={() => handleSetFilterDays(30)}
      >
        Next 30 Days
      </button>
    </div>
  );
}
