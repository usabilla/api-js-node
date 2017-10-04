const Usabilla = require('../src/index');
const WebsitesProduct = require('../src/resources/websitesProduct');
const EmailProduct = require('../src/resources/emailProduct');
const AppsProduct = require('../src/resources/appsProduct');

describe('Usabilla', function() {

  beforeEach(function() {
    this.usabilla = new Usabilla('access', 'secret');
  });

  it('should have proper config on init', function() {
    expect(this.usabilla.config).toEqual({
      protocol: 'https',
      host: 'data.usabilla.com',
      port: null,
      iterator: true
    });
  });

  it('has resources instantiated', function() {
    expect(this.usabilla.websites instanceof WebsitesProduct).toBe(true);
    expect(this.usabilla.email instanceof EmailProduct).toBe(true);
    expect(this.usabilla.apps instanceof AppsProduct).toBe(true);
  });
});
