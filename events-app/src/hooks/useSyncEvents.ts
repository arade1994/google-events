import { useMutation, useQueryClient } from "@tanstack/react-query";
import { syncEvents } from "../services/api";
import { useSearchParams } from "react-router";
import toast from "react-hot-toast";

export function useSyncEvents() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const filterDays = Number(searchParams.get("filterDays")) || 7;

  const { mutate: triggerSync, isPending: isSyncing } = useMutation({
    mutationFn: syncEvents,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["events", filterDays] });
      toast.success("Events synced");
    },
    onError: () => {
      toast.error("Failed to sync events");
    },
  });

  return { triggerSync, isSyncing };
}
