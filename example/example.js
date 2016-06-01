/**
 * argv[0] Access Key
 * argv[1] Secret Key
 */
const args = require('yargs').argv._;
const usabilla = require('../dist');

const api = new usabilla.Usabilla(args[0], args[1]);

// Get all buttons for this account.
api.websites.buttons.get().then((response) => {
  const buttons = response.items;

  // Use the button id to get feedback for this button id.
  var buttonFeedbackQuery = {
    id: buttons[1].id,
    params: {
      limit: 1
    }
  };

  api.websites.buttons.feedback.get(buttonFeedbackQuery).then((feedback) => {
    console.log(feedback);
  });
});

// Get all campaigns for this account.
api.websites.campaigns.get().then((response) => {
  const campaigns = response.items;

  // Get the results for a campaign with id.
  var campaignQuery = {
    id: campaigns[0].id
  };

  api.websites.campaigns.resutls(campaignQuery).then((results) => {
    console.log(results);
  });

  api.websites.campaigns.stats(campaignQuery).then((results) => {
    console.log(results);
  });
});
