import { logger } from '../utils/logger';
import { getConfig } from '../utils/config';
import { formatCalendarEventsForTelegram } from '../utils/formatter';
import type { DayEvents, NotificationPayload } from '../types';

export class NotificationService {
  private config = getConfig();

  private async sendNotification(payload: NotificationPayload): Promise<void> {
    const url = this.config.tugNsApiUrl;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config.tugNsApiKey,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    };

    try {
      const response = await fetch(url, options);
      clearTimeout(timeout);
      
      if (!response.ok) {
        const errorText = await response.text();
        logger.error(
          { status: response.status, error: errorText },
          'Failed to send notification'
        );
        throw new Error(`Notification API returned status ${response.status}`);
      }

      const responseText = await response.text();
      logger.info({ response: responseText }, 'Notification sent successfully');
    } catch (error) {
      clearTimeout(timeout);
      if (error instanceof Error && error.name === 'AbortError') {
        logger.error('Notification request timed out after 10s');
        throw new Error('Notification request timed out');
      }
      logger.error({ error }, 'Error sending notification');
      throw error;
    }
  }

  async postCalendarEvents(
    dayEvents: DayEvents[],
    reportType: string
  ): Promise<{ status: string; message: string }> {
    if (dayEvents.length === 0) {
      const message = `No events to process for ${reportType}`;
      logger.info({ reportType }, message);
      return {
        status: 'success',
        message,
      };
    }

    const formattedMessages = formatCalendarEventsForTelegram(dayEvents, reportType);

    const payload: NotificationPayload = {
      type: 'calendar',
      payload: formattedMessages,
    };

    logger.info(
      { reportType, eventCount: dayEvents.length },
      'Sending calendar events notification'
    );

    await this.sendNotification(payload);

    return {
      status: 'success',
      message: `Posted ${dayEvents.length} day(s) of events for ${reportType}`,
    };
  }
}

