const Usabilla = require('../../src/index');
const WidgetsResource = require('../../src/resources/widgetsResource');

describe('Usabilla Email Product', function() {
  beforeEach(function() {
    this.usabilla = new Usabilla('access', 'secret');
  });

  it('has resources instantiated', function() {
    expect(this.usabilla.email.widgets instanceof WidgetsResource).toBe(true);
  });
});
