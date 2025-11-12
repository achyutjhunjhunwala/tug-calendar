import type { ScheduledHandler } from 'aws-lambda';
import { GoogleCalendarService } from '../services/google.service';
import { NotificationService } from '../services/notification.service';
import {
  getEventsForNextXDays,
  isFirstDayOfMonth,
  getDaysInMonth,
} from '../utils/calendar.utils';
import { logger } from '../utils/logger';

const googleCalendarService = new GoogleCalendarService();
const notificationService = new NotificationService();

export const handler: ScheduledHandler = async (event, context) => {
  logger.info({ event, requestId: context.awsRequestId }, 'Monthly handler triggered');

  try {
    const today = new Date();

    if (!isFirstDayOfMonth(today)) {
      logger.info('Today is not the 1st day of month, skipping monthly report');
      return;
    }

    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const numberOfDaysInMonth = getDaysInMonth(currentYear, currentMonth);

    const events = await googleCalendarService.getCalendarEvents();
    logger.info({ eventCount: events.length }, 'Retrieved calendar events');

    if (events.length === 0) {
      logger.info('No events found');
      return;
    }

    const monthEvents = getEventsForNextXDays(numberOfDaysInMonth, events);
    const result = await notificationService.postCalendarEvents(
      monthEvents,
      'Monthly Report'
    );

    logger.info({ result }, 'Monthly report completed successfully');
  } catch (error) {
    logger.error({ error }, 'Error processing monthly report');
    throw error;
  }
};

