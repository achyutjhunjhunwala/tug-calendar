export interface GoogleCalendarEvent {
  summary: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
}

export interface CalendarEvent {
  title: string;
  start: string;
  end: string;
  duration: string;
}

export interface DayEvents {
  date: Date;
  events: CalendarEvent[];
}

export interface NotificationPayload {
  type: 'calendar';
  payload: string[];
}

