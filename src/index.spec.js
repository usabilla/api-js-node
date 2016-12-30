const Usabilla = require('./../src/index.js');

describe('Usabilla', () => {
  let usabilla;

  beforeEach(() => {
    usabilla = new Usabilla();
  });

  it('should have proper config on init', () => {
    const config = usabilla.configure({foo: 'bar'});
    expect(config).toEqual({
      method: 'GET',
      host: 'data.usabilla.com',
      iterator: true,
      foo: 'bar'
    });
  });
});
