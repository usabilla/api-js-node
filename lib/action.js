const request = require('./request');

function action(
  apiOptions,
  endpointOptions,
  accessKey,
  privateKey,
  options = {}
) {
  const requestOptions = {
    protocol: apiOptions.protocol,
    host: apiOptions.host,
    iterator: apiOptions.iterator,
    method: endpointOptions.method,
    path: endpointOptions.path
  };

  return request(requestOptions, accessKey, privateKey, options);
}

module.exports = action;
