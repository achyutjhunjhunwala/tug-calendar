const isFirstDayOfMonth = (date = new Date()) => {
  const firstDayCurrentMonth = new Date();
  firstDayCurrentMonth.setDate(1);

  return firstDayCurrentMonth.toDateString() === date.toDateString();
}

const getDaysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
}

const getEventsForNextXDays = (numberOfDays, events) => {
  const today = new Date();
  const nextXDays = [];
  for (let i = 0; i < numberOfDays; i++) {
    const nextDay = new Date(today.getTime() + (i * 24 * 60 * 60 * 1000));
    const nextDayEvents = events.filter(event => {
      const eventDate = new Date(event.start.dateTime);
      return eventDate.getDate() === nextDay.getDate() &&
        eventDate.getMonth() === nextDay.getMonth() &&
        eventDate.getFullYear() === nextDay.getFullYear();
    }).map(event => {
      return {
        title: event.summary,
        start: event.start.dateTime,
        end: event.end.dateTime,
        duration: (new Date(event.end.dateTime) - new Date(event.start.dateTime))/1000/60 + ' minutes'
      }
    });
    nextXDays.push({
      date: nextDay,
      events: nextDayEvents
    });
  }
  return nextXDays;
};

module.exports = {
  isFirstDayOfMonth,
  getDaysInMonth,
  getEventsForNextXDays
}