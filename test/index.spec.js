const Usabilla = require('../lib/index');

describe('index', () => {
  let api;

  beforeEach(() => {
    api = new Usabilla('api-key', 'private-key');
  });

  it('sets up actions using endpoint configuration', () => {
    expect(api.websites.buttons.get).toBeDefined();
    expect(api.websites.buttons.feedback.get).toBeDefined();
    expect(api.websites.campaigns.get).toBeDefined();
    expect(api.websites.campaigns.results.get).toBeDefined();
    expect(api.websites.campaigns.stats.get).toBeDefined();
    expect(api.websites.inpage.get).toBeDefined();
    expect(api.websites.inpage.feedback.get).toBeDefined();
    expect(api.email.widgets.get).toBeDefined();
    expect(api.email.widgets.feedback.get).toBeDefined();
    expect(api.apps.forms.get).toBeDefined();
    expect(api.apps.forms.feedback.get).toBeDefined();
    expect(api.apps.campaigns.get).toBeDefined();
    expect(api.apps.campaigns.results.get).toBeDefined();
  });
});
