const Usabilla = require('../../src/index');
const FormsResource = require('../../src/resources/formsResource');
const AppsCampaignsResource = require('../../src/resources/appsCampaignsResource');

describe('Usabilla Apps Product', function() {
  beforeEach(function() {
    this.usabilla = new Usabilla('access', 'secret');
  });

  it('has resources instantiated', function() {
    expect(this.usabilla.apps.forms instanceof FormsResource).toBe(true);
    expect(this.usabilla.apps.campaigns instanceof AppsCampaignsResource).toBe(true);
  });
});
