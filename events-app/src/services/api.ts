import { type Event } from "../types/Event";

const API = "http://localhost:4000";

export async function getEvents(filterDays: number): Promise<Event[]> {
  const res = await fetch(`${API}/events/${filterDays}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch events");
  return await res.json();
}

export async function syncEvents() {
  const res = await fetch(`${API}/events/sync`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to sync events");
}
