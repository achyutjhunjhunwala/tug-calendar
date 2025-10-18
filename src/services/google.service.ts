import { google } from 'googleapis';
import type { JWT } from 'google-auth-library';
import { logger } from '../utils/logger';
import type { GoogleCalendarEvent, GoogleServiceAccount } from '../types';
import * as serviceAccount from '../../tug-calendar-93d646f8c570.json';

const MAX_EVENTS = 100;
const CALENDAR_ID = 'pcl9qikhvn522cqijuoitfse2s@group.calendar.google.com';

export class GoogleCalendarService {
  private calendar = google.calendar('v3');
  private serviceAccount = serviceAccount as GoogleServiceAccount;

  private createAuthClient(): JWT {
    return new google.auth.JWT(
      this.serviceAccount.client_email,
      undefined,
      this.serviceAccount.private_key,
      ['https://www.googleapis.com/auth/calendar']
    );
  }

  private async authorizeAuthClient(authClient: JWT): Promise<void> {
    try {
      await authClient.authorize();
      logger.info('Successfully authorized Google Calendar API client');
    } catch (error) {
      logger.error({ error }, 'Failed to authorize Google Calendar API client');
      throw error;
    }
  }

  async getCalendarEvents(): Promise<GoogleCalendarEvent[]> {
    try {
      const authClient = this.createAuthClient();
      await this.authorizeAuthClient(authClient);

      const response = await this.calendar.events.list({
        auth: authClient,
        calendarId: CALENDAR_ID,
        timeMin: new Date().toISOString(),
        maxResults: MAX_EVENTS,
        singleEvents: true,
        orderBy: 'startTime',
        showDeleted: false,
      });

      const events = response.data.items || [];
      logger.info(
        { eventCount: events.length },
        `Retrieved upcoming events from Calendar`
      );

      return events as GoogleCalendarEvent[];
    } catch (error) {
      logger.error({ error }, 'Failed to retrieve calendar events');
      throw error;
    }
  }
}
