const { getEventsForNextXDays } = require('./utils/calendar');
const { postNextXDaysEvents } = require('./utils/external');
const { configureAuthClient, authoriseAuthClient, getCalendarEvents } = require('./utils/google');

const triggerDailyReports = async (events) => {
  const nextXDays = getEventsForNextXDays(1, events);
  return postNextXDaysEvents(nextXDays, 'Daily Report');
}

const main = async () => {
  const authClient = configureAuthClient();
  const tokens = await authoriseAuthClient(authClient);
  const events = await getCalendarEvents(authClient);
  console.log('Received events: ', events?.length);

  if (events?.length) {
    const dailyEvents = await triggerDailyReports(events);
    console.log('Daily events: ', dailyEvents);
  } else {
    console.log('No events found');
  }
};

module.exports = {
  main,
};