const axios = require('axios');

function request(requestOptions) {
  return axios({
    method: requestOptions.method,
    url: requestOptions.url,
    baseURL: `${requestOptions.protocol}://${requestOptions.host}`,
    headers: requestOptions.headers
  }).then(response => response.data);
}

module.exports = request;
