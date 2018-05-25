const axios = require('axios');
const ClientError = require('./error');
const { sign } = require('./signing');

// This doesn't really make sense anymore as the version won't change (0.0.0-development)
// We should probably read the tags and use the latest one as version.
function getDefaultHeaders(version) {
  return {
    'x-ub-api-client': `Usabilla API Node Client/${version}`
  };
}

function performRequest(
  requestOptions,
  accessKey,
  privateKey,
  headers,
  options,
  items
) {
  const signature = sign(
    accessKey,
    privateKey,
    requestOptions.path,
    headers,
    options
  );

  return axios({
    method: requestOptions.method,
    url: signature.url,
    baseURL: `${requestOptions.protocol}://${requestOptions.host}`,
    headers: signature.headers
  })
    .then(response => response.data)
    .then(data => {
      items = items.concat(data.items);

      if (data.hasMore && requestOptions.iterator) {
        const params = Object.assign({}, options.params, {
          since: data.lastTimestamp
        });

        const updatedOptions = Object.assign({}, options, { params });

        return performRequest(
          requestOptions,
          accessKey,
          privateKey,
          headers,
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

function request(requestOptions, accessKey, privateKey, options) {
  const headers = getDefaultHeaders(process.env.VERSION);

  return performRequest(
    requestOptions,
    accessKey,
    privateKey,
    headers,
    options,
    []
  );
}

module.exports = request;
