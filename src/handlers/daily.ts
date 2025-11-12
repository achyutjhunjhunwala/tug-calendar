import type { ScheduledHandler } from 'aws-lambda';
import { GoogleCalendarService } from '../services/google.service';
import { NotificationService } from '../services/notification.service';
import { getEventsForNextXDays } from '../utils/calendar.utils';
import { logger } from '../utils/logger';

const googleCalendarService = new GoogleCalendarService();
const notificationService = new NotificationService();

export const handler: ScheduledHandler = async (event, context) => {
  logger.info({ event, requestId: context.awsRequestId }, 'Daily handler triggered');

  try {
    const events = await googleCalendarService.getCalendarEvents();
    logger.info({ eventCount: events.length }, 'Retrieved calendar events');

    if (events.length === 0) {
      logger.info('No events found');
      return;
    }

    const nextDayEvents = getEventsForNextXDays(1, events);
    const result = await notificationService.postCalendarEvents(
      nextDayEvents,
      'Daily Report'
    );

    logger.info({ result }, 'Daily report completed successfully');
  } catch (error) {
    logger.error({ error }, 'Error processing daily report');
    throw error;
  }
};

