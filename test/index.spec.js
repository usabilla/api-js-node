const Usabilla = require('../src/index');

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
