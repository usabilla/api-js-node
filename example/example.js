/**
 * argv[0] Access Key
 * argv[1] Secret Key
 * argv[2] Button id
 */

// When you are using your own setup this should require the usabilla node js client instead.
const usabilla = require('../');
const request = require('request');
const argv = require('yargs').argv;

const args = argv._;

const constants = usabilla.getConstants();

const resource = {
  scope: constants.SCOPE_LIVE,
  product: constants.PRODUCT_WEBSITES,
  resource_type: constants.RESOURCE_FEEDBACK
};

const credentials = {
  access_key: args[0],
  secret_key: args[1]
};

const query = {
  resource_id: '*',
  button_id: args[2],
  urlParameters: {
    limit: 10
  }
};

const options = usabilla.getOptions(resource, credentials, query);

request(options, function(error, response, body) {
  console.log(JSON.parse(body));
});
