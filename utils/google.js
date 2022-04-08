const { google } = require('googleapis');
const calendar = google.calendar('v3');
const privateKey = require("../tug-calendar-f52da1f5cc70.json");

const MAX_EVENTS = 100;

const configureAuthClient = () => {
  return new google.auth.JWT(
    privateKey.client_email,
    null,
    privateKey.private_key,
    ['https://www.googleapis.com/auth/calendar']
  );
};

const authoriseAuthClient = (authClient) => {
  return new Promise((resolve, reject) => {
    authClient.authorize((err, tokens) => {
      if (err) {
        reject(err);
      } else {
        resolve(tokens);
      }
    });
  });
};

const getCalendarEvents = (authClient) => {
  return new Promise((resolve, reject) => {
    calendar.events.list({
      auth: authClient,
      calendarId: 'pcl9qikhvn522cqijuoitfse2s@group.calendar.google.com',
      timeMin: (new Date()).toISOString(),
      maxResults: MAX_EVENTS,
      singleEvents: true,
      orderBy: 'startTime',
      showDeleted: false,
    }, (err, response) => {
      if (err) {
        console.log('The API returned an error: ' + err);
        reject(err);
      } else {
        const events = response.data.items;
        if (events.length) {
          console.log(`Requested upcoming events from Calendar: ${MAX_EVENTS}`);
          events.map((event, i) => {
            const start = event.start.dateTime || event.start.date;
            // console.log(`${start} - ${event.summary}`);
          });

          resolve(events)
        } else {
          console.log('No upcoming events found.');
        }
      }
    });
  });
};

module.exports = {
  configureAuthClient,
  authoriseAuthClient,
  getCalendarEvents
};