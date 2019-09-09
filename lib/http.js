const Axios = require('axios');

async function send(url, method = 'GET', headers = {}, data) {

  if ( headers['Access-Control-Allow-Origin'] === undefined) {
    headers['Access-Control-Allow-Origin'] = '*';
  }

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
