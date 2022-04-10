const fetch = require("node-fetch");

const informTugNs = async (message) => {
  const { TUG_NS_API, TUG_NS_TOKEN } = process.env;
  const url = TUG_NS_API

  const postBody = {
    type: 'NOTIFY_CALENDAR',
    message
  }

  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': TUG_NS_TOKEN
    },
    body: JSON.stringify(postBody)
  }

  const response = await fetch(url, options);

  return response.json();
}

const postNextXDaysEvents = async (nextXDays, subject) => {
  if (nextXDays?.length > 0) {
    const timeEvents = {
      subject: subject,
      events: nextXDays
    }
    const postedResponse = await informTugNs(timeEvents);
    console.log('Posted response: ', postedResponse);
    return postedResponse
  }

  return Promise.resolve({
    status: 'success',
    message: `No events to process for ${subject}`
  })
}

module.exports = {
  informTugNs,
  postNextXDaysEvents
}