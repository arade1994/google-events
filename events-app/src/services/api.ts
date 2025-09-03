import { type CreateEventData, type Event } from "../types/Event";

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

export async function createEvent(eventData: CreateEventData) {
  const res = await fetch(`${API}/events/create`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventData),
  });
  if (!res.ok) throw new Error("Failed to create event");
  return await res.json();
}
