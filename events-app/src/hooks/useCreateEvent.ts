import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import type { CreateEventData } from "../types/Event";
import { createEvent as createEventApi } from "../services/api";
import toast from "react-hot-toast";

export function useCreateEvent() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const filterDays = Number(searchParams.get("filterDays")) || 7;

  const { mutate: createEvent, isPending: isCreatingEvent } = useMutation({
    mutationFn: (data: CreateEventData) => createEventApi(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["events", filterDays] });
      toast.success("Event successfully created");
    },
    onError: () => {
      toast.error("Failed to create new event");
    },
  });

  return { createEvent, isCreatingEvent };
}
