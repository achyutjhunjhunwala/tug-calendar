import type { GoogleCalendarEvent, CalendarEvent, DayEvents } from '../types';

export const isFirstDayOfMonth = (date: Date = new Date()): boolean => {
  const firstDayCurrentMonth = new Date();
  firstDayCurrentMonth.setDate(1);
  return firstDayCurrentMonth.toDateString() === date.toDateString();
};

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month, 0).getDate();
};

export const getEventsForNextXDays = (
  numberOfDays: number,
  events: GoogleCalendarEvent[]
): DayEvents[] => {
  const today = new Date();
  const nextXDays: DayEvents[] = [];

  for (let i = 0; i < numberOfDays; i++) {
    const nextDay = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
    const nextDayEvents = events
      .filter((event) => {
        if (!event.start.dateTime) return false;
        const eventDate = new Date(event.start.dateTime);
        return (
          eventDate.getDate() === nextDay.getDate() &&
          eventDate.getMonth() === nextDay.getMonth() &&
          eventDate.getFullYear() === nextDay.getFullYear()
        );
      })
      .map((event): CalendarEvent | null => {
        if (!event.start.dateTime || !event.end.dateTime) return null;
        const durationMinutes =
          (new Date(event.end.dateTime).getTime() -
            new Date(event.start.dateTime).getTime()) /
          1000 /
          60;
        return {
          title: event.summary,
          start: event.start.dateTime,
          end: event.end.dateTime,
          duration: `${durationMinutes} minutes`,
        };
      })
      .filter((event): event is CalendarEvent => event !== null && !!event.title);

    if (nextDayEvents.length > 0) {
      nextXDays.push({
        date: nextDay,
        events: nextDayEvents,
      });
    }
  }

  return nextXDays;
};

