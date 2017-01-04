/**
 * argv[0] Access Key
 * argv[1] Secret Key
 */
const args = require('yargs').argv._;
const Usabilla = require('../dist');

const usabilla = new Usabilla(args[0], args[1]);

// Get all buttons for this account.
usabilla.websites.buttons.get().then((buttons) => {

  // Use the button id to get feedback for this button id.
  let buttonFeedbackQuery = {
    id: buttons[0].id,
    params: {
      limit: 10
    }
  };
  usabilla.websites.buttons.feedback.get(buttonFeedbackQuery).then((feedback) => {
    console.log('# button feedback', feedback.length);
  });

}).catch((reason) => {
  // If the usabilla call fails, we want to see the error message
  console.error(reason);
});


// Get all campaigns for this account.
usabilla.websites.campaigns.get().then((campaigns) => {

  // Get the results for a campaign with id.
  let campaignQuery = {
    id: campaigns[0].id
  };

  // Get the responses of the first campaign
  usabilla.websites.campaigns.results.get(campaignQuery).then((responses) => {
    console.log('# campaign responses', responses.length);
  });

  // Get the stats of the first campaign
  usabilla.websites.campaigns.stats.get(campaignQuery).then((stats) => {
    console.log('campaign stats', stats);
  });
});

// Get all inpage widgets for this account.
usabilla.websites.inpage.get().then((inPageWidgets) => {

  // Get the feedback for a inpage widget with id.
  let inPageQuery = {
    id: inPageWidgets[0].id
  };

  // Get the feedback of the first inpage widget
  usabilla.websites.inpage.feedback.get(inPageQuery).then((feedback) => {
    console.log('# inpage feedback', feedback.length);
  });
});

// Get all email widgets for this account.
usabilla.email.widgets.get().then((emailWidgets) => {

  // Get the feedback for a email widget with id.
  let emailQuery = {
    id: emailWidgets[0].id
  };

  // Get the feedback of the first email widget
  usabilla.email.widgets.feedback.get(emailQuery).then((feedback) => {
    console.log('# email feedback', feedback.length);
  });
});

// Get all apps forms for this account.
usabilla.apps.forms.get().then((appsForms) => {

  // Get the feedback for a apps form with id.
  let appsQuery = {
    id: appsForms[1].id
  };

  // Get the feedback of the second app form
  usabilla.apps.forms.feedback.get(appsQuery).then((feedback) => {
    console.log('# apps feedback', feedback.length);
  });
});
