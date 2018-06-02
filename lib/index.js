const action = require('./action');
const endpoints = require('./endpoints.json');

const DEFAULT_API_OPTIONS = {
  protocol: 'https',
  host: 'data.usabilla.com',
  port: null,
  iterator: true
};

function createActions(actions, endpoints, apiOptions, accessKey, privateKey) {
  Object.keys(endpoints).forEach(actionName => {
    if (actionName !== 'get') {
      actions[actionName] = {};

      return createActions(
        actions[actionName],
        endpoints[actionName],
        apiOptions,
        accessKey,
        privateKey
      );
    }

    const endpointOptions = endpoints[actionName];

    actions[actionName] = action.bind(
      null,
      apiOptions,
      endpointOptions,
      accessKey,
      privateKey
    );
  });
}

function parseApiOptions(options) {
  const apiOptions = Object.assign({}, DEFAULT_API_OPTIONS, options);

  if (apiOptions.port) {
    // This is for backwards compatibility to use host and port as separate properties in the configuration
    apiOptions.host = `${apiOptions.host}:${apiOptions.port}`;
  }

  return apiOptions;
}

function createClient(accessKey, privateKey, options) {
  const apiOptions = parseApiOptions(options);

  const actions = {};

  createActions(actions, endpoints, apiOptions, accessKey, privateKey);

  return actions;
}

module.exports = createClient;
