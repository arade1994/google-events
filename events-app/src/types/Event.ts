export interface Event {
  id: string;
  googleEventId: string;
  name: string;
  description?: string;
  start: string;
  end: string;
}

export interface CreateEventData {
  name: string;
  description: string;
  startTime: string;
  endTime: string;
}
