export interface AttendeeType {
  email: string;
  status: 'accepted' | 'declined' | 'tentative' | 'needsAction';
}

export type EventType = {
  summary: string
  start: string;
  end: string;
  attendees: AttendeeType[];
};
