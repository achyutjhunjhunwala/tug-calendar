import type { DayEvents } from '../types';

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatCalendarEventsForTelegram = (
  dayEvents: DayEvents[],
  reportType: string
): string[] => {
  if (dayEvents.length === 0) {
    return [`${reportType}\n\nNo events scheduled.`];
  }

  const messages: string[] = [];

  for (const day of dayEvents) {
    let message = `📅 ${reportType}\n`;
    message += `${'─'.repeat(30)}\n`;
    message += `Date: ${formatDate(day.date)}\n\n`;

    for (const event of day.events) {
      const startTime = formatTime(event.start);
      const endTime = formatTime(event.end);
      
      message += `⏰ ${startTime} - ${endTime}\n`;
      message += `${event.title}\n`;
      message += `Duration: ${event.duration}\n\n`;
    }

    messages.push(message.trim());
  }

  return messages;
};

