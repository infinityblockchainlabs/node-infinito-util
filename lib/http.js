const Axios = require('axios');

async function send(url, method = 'GET', headers, data) {
  return await Axios({
    url,
    method: method,
    headers: headers,
    data: data || {},
  });
}

module.exports = {
  send: send,
};