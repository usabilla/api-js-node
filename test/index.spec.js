const Usabilla = require('../src/index');
const resources = require('../src/resources');

describe('Usabilla', function() {

  beforeEach(function() {
    this.usabilla = new Usabilla('access', 'secret');
  });

  it('should have proper config on init', function() {
    expect(this.usabilla.config).toEqual({
      method: 'GET',
      host: 'data.usabilla.com',
      iterator: true
    });
  });

  it('has resources instantiated', function() {
    expect(this.usabilla.websites instanceof resources.WebsitesProduct).toBe(true);
    expect(this.usabilla.email instanceof resources.EmailProduct).toBe(true);
    expect(this.usabilla.apps instanceof resources.AppsProduct).toBe(true);
  });

  describe('configure', function() {
    it('updates config with passed data', function() {
      this.usabilla.configure({
        method: 'POST',
        foo: 'bar'
      });
      expect(this.usabilla.config.method).toEqual('POST');
      expect(this.usabilla.config.foo).toEqual('bar');
    });
  });
});
