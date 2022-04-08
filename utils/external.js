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

module.exports = {
  informTugNs
}