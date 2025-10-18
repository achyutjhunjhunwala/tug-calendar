import type { ScheduledHandler } from 'aws-lambda';
import { GoogleCalendarService } from '../services/google.service';
import { NotificationService } from '../services/notification.service';
import { getEventsForNextXDays } from '../utils/calendar.utils';
import { logger } from '../utils/logger';

const googleCalendarService = new GoogleCalendarService();
const notificationService = new NotificationService();

export const handler: ScheduledHandler = async (event, context) => {
  logger.info({ event, requestId: context.awsRequestId }, 'Weekly handler triggered');

  try {
    const currentDayOfWeek = new Date().getDay();

    if (currentDayOfWeek !== 0) {
      logger.info({ currentDayOfWeek }, 'Today is not Sunday, skipping weekly report');
      return;
    }

    const events = await googleCalendarService.getCalendarEvents();
    logger.info({ eventCount: events.length }, 'Retrieved calendar events');

    if (events.length === 0) {
      logger.info('No events found');
      return;
    }

    const nextWeekEvents = getEventsForNextXDays(7, events);
    const result = await notificationService.postCalendarEvents(
      nextWeekEvents,
      'Weekly Report'
    );

    logger.info({ result }, 'Weekly report completed successfully');
  } catch (error) {
    logger.error({ error }, 'Error processing weekly report');
    throw error;
  }
};

