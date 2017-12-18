const Usabilla = require('../../src/index');
const ButtonsResource = require('../../src/resources/buttonsResource');
const WebCampaignsResource = require('../../src/resources/webCampaignsResource');
const InPageResource = require('../../src/resources/inPageResource');

describe('Usabilla Web Product', function() {
  beforeEach(function() {
    this.usabilla = new Usabilla('access', 'secret');
  });

  it('has resources instantiated', function() {
    expect(this.usabilla.websites.buttons instanceof ButtonsResource).toBe(true);
    expect(this.usabilla.websites.campaigns instanceof WebCampaignsResource).toBe(true);
    expect(this.usabilla.websites.inpage instanceof InPageResource).toBe(true);
  });
});
