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

  // Get a single feedback from the second button
  api.websites.buttons.feedback.get(buttonFeedbackQuery).then((feedback) => {
    console.log(feedback);
  });
}).catch((reason) => {
  console.error(reason);
});


// Get all campaigns for this account.
api.websites.campaigns.get().then((response) => {
  const campaigns = response.items;

  // Get the results for a campaign with id.
  var campaignQuery = {
    id: campaigns[0].id
  };

  // Get the responses of the first campaign
  api.websites.campaigns.results.get(campaignQuery).then((results) => {
    console.log(results);
  });

  // Get the stats of the first campaign
  api.websites.campaigns.stats.get(campaignQuery).then((results) => {
    console.log(results);
  });
});

// Get all inpage widgets for this account.
api.websites.inpage.get().then((response) => {
  const inpage_widgets = response.items;

  // Get the feedback for a inpage widget with id.
  var inPageQuery = {
    id: inpage_widgets[0].id
  };

  // Get feedback from the first inpage widget
  api.websites.inpage.feedback.get(inPageQuery).then((results) => {
    console.log(results.items);
  });
});
