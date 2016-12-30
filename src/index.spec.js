import Usabilla from './index';

describe('Index', () => {
  describe('Usabilla', () => {
    let usabilla;

    usabilla = new Usabilla();

    it('should have proper config on init', () => {

      let config = usabilla.configure({foo: 'bar'});

      let expected_config = {
        method: 'GET',
        host: 'data.usabilla.com',
        iterator: true,
        foo: 'bar'
      }

      expect(config).toEqual(expected_config);
    });
  });
});
