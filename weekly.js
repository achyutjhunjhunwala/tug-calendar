const {configureAuthClient, authoriseAuthClient, getCalendarEvents} = require("./utils/google");
const {getEventsForNextXDays} = require("./utils/calendar");
const {postNextXDaysEvents} = require("./utils/external");

const triggerWeeklyReports = async (events) => {
  const currentDayOFWeek = new Date().getDay();
  if (currentDayOFWeek === 0) {
    const nextXDays = getEventsForNextXDays(7, events);
    return postNextXDaysEvents(nextXDays, 'Weekly Report');
  }

  return Promise.resolve({
    message: 'Today is not Sunday'
  })
}

const main = async () => {
  const authClient = configureAuthClient();
  const tokens = await authoriseAuthClient(authClient);
  const events = await getCalendarEvents(authClient);
  console.log('Received events: ', events?.length);

  if (events?.length) {
    const weeklyEvents = await triggerWeeklyReports(events);
    console.log('Weekly events: ', weeklyEvents);
  } else {
    console.log('No events found');
  }
};

module.exports = {
  main,
};