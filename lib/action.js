const request = require('./request');
const { sign } = require('./signing');
const ClientError = require('./error');

// This doesn't really make sense anymore as the version won't change (0.0.0-development)
// We should probably read the tags and use the latest one as version.
function getDefaultHeaders(version) {
  return {
    'x-ub-api-client': `Usabilla API Node Client/${version}`
  };
}

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
    headers: getDefaultHeaders(process.env.VERSION)
  };

  return performRequest(requestOptions, accessKey, privateKey, options, []);
}

module.exports = action;
