const {configureAuthClient, authoriseAuthClient, getCalendarEvents} = require("./utils/google");
const {isFirstDayOfMonth, getDaysInMonth, getEventsForNextXDays} = require("./utils/calendar");
const {postNextXDaysEvents} = require("./utils/external");

const triggerMonthlyReports = async (events) => {
  const today = new Date();
  if (isFirstDayOfMonth(today)) {
    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth() + 1;

    const numberOfDaysInMonth = getDaysInMonth(currentYear, currentMonth);
    const nextXDays = getEventsForNextXDays(numberOfDaysInMonth, events);
    return postNextXDaysEvents(nextXDays, 'Monthly Report');
  }

  return Promise.resolve({
    message: 'Today is not 1st day of month',
  })
}

const main = async () => {
  const authClient = configureAuthClient();
  const tokens = await authoriseAuthClient(authClient);
  const events = await getCalendarEvents(authClient);
  console.log('Received events: ', events?.length);

  if (events?.length) {
    const monthlyEvents = await triggerMonthlyReports(events);
    console.log('Monthly events: ', monthlyEvents);
  } else {
    console.log('No events found');
  }
};

module.exports = {
  main,
};