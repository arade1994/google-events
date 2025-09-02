import { useQuery } from "@tanstack/react-query";
import { getEvents } from "../services/api";
import { useSearchParams } from "react-router";

export function useFetchEvents() {
  const [searchParams] = useSearchParams();
  const filterDays = Number(searchParams.get("filterDays")) || 7;

  const { data: events, isLoading: isFetchingEvents } = useQuery({
    queryKey: ["events", filterDays],
    queryFn: () => getEvents(filterDays),
    placeholderData: [],
  });

  return { events, isFetchingEvents };
}
