const request = require('./request');
const { sign } = require('./signing');
const ClientError = require('./error');

function performRequest(requestOptions, accessKey, privateKey, options, items) {
  const signature = sign(
    accessKey,
    privateKey,
    requestOptions.path,
    requestOptions.headers,
    options
  );

  return request({
    method: requestOptions.method,
    url: signature.url,
    protocol: requestOptions.protocol,
    host: requestOptions.host,
    headers: signature.headers
  })
    .then(data => {
      items = items.concat(data.items);

      const shouldIterate = data.hasMore && requestOptions.iterator;

      if (shouldIterate) {
        const params = Object.assign({}, options.params, {
          since: data.lastTimestamp
        });

        const updatedOptions = Object.assign({}, options, { params });

        return performRequest(
          requestOptions,
          accessKey,
          privateKey,
          updatedOptions,
          items
        );
      }

      return items;
    })
    .catch(errorResponse => {
      throw new ClientError(errorResponse);
    });
}

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
    path: endpointOptions.path,
    headers: {}
  };

  return performRequest(requestOptions, accessKey, privateKey, options, []);
}

module.exports = action;
