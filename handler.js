// // Obsolete File, no more used
//
// const { isFirstDayOfMonth, getDaysInMonth, getEventsForNextXDays } = require('./utils/calendar');
// const { postNextXDaysEvents } = require('./utils/external');
// const { configureAuthClient, authoriseAuthClient, getCalendarEvents } = require('./utils/google');
//
// const triggerMonthlyReports = async (events) => {
//   const today = new Date();
//   if (isFirstDayOfMonth(today)) {
//     const date = new Date();
//     const currentYear = date.getFullYear();
//     const currentMonth = date.getMonth() + 1;
//
//     const numberOfDaysInMonth = getDaysInMonth(currentYear, currentMonth);
//     const nextXDays = getEventsForNextXDays(numberOfDaysInMonth, events);
//     return postNextXDaysEvents(nextXDays, 'Monthly Report');
//   }
//
//   return Promise.resolve({
//     message: 'Today is not 1st day of month',
//   })
// }
//
// const triggerWeeklyReports = async (events) => {
//   const currentDayOFWeek = new Date().getDay();
//   if (currentDayOFWeek === 0) {
//     const nextXDays = getEventsForNextXDays(7, events);
//     return postNextXDaysEvents(nextXDays, 'Weekly Report');
//   }
//
//   return Promise.resolve({
//     message: 'Today is not Sunday'
//   })
// }
//
// const triggerDailyReports = async (events) => {
//   const nextXDays = getEventsForNextXDays(1, events);
//   return postNextXDaysEvents(nextXDays, 'Daily Report');
// }
//
// const main = async () => {
//   const authClient = configureAuthClient();
//   const tokens = await authoriseAuthClient(authClient);
//   const events = await getCalendarEvents(authClient);
//   console.log('Received events: ', events?.length);
//
//   if (events?.length) {
//     const dailyEvents = await triggerDailyReports(events);
//     console.log('Daily events: ', dailyEvents);
//     const weeklyEvents = await triggerWeeklyReports(events);
//     console.log('Weekly events: ', weeklyEvents);
//     const monthlyEvents = await triggerMonthlyReports(events);
//     console.log('Monthly events: ', monthlyEvents);
//   } else {
//     console.log('No events found');
//   }
// };
//
// module.exports = {
//   main,
// };