/**
 * argv[0] Access Key
 * argv[1] Secret Key
 * argv[2] Button id
 */
const args = require('yargs').argv._;
const usabilla = require('../dist');

const api = new usabilla.Usabilla(args[0], args[1]);

// Use the button id to get feedback for this button id.
api.websites.buttons.get(args[2]).then((data) => {
  console.log(data);
});
