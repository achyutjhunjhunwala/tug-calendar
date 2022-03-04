const { google } = require('googleapis');
const calendar = google.calendar('v3');
const privatekey = require("./tug-calendar-f52da1f5cc70.json");

const configureAuthClient = () => {
  return new google.auth.JWT(
    privatekey.client_email,
    null,
    privatekey.private_key,
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
      maxResults: 9999,
      singleEvents: true,
      orderBy: 'startTime',
      showDeleted: true,
    }, (err, response) => {
      if (err) {
        console.log('The API returned an error: ' + err);
        reject(err);
      } else {
        const events = response.data.items;
        if (events.length) {
          console.log('Upcoming 10 events:');
          events.map((event, i) => {
            const start = event.start.dateTime || event.start.date;
            console.log(`${start} - ${event.summary}`);
          });

          resolve(events)
        } else {
          console.log('No upcoming events found.');
        }
      }
    });
  });
};

const run = async () => {
  const authClient = configureAuthClient();
  const tokens = await authoriseAuthClient(authClient);
  console.log('tokens :', tokens);
  const events = await getCalendarEvents(authClient);
  console.log(events);
};

run();