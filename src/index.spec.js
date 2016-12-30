import Usabilla from './index';

describe('Index', () => {
  describe('Usabilla', () => {
    let usabilla;

    beforeEach(() => {
      usabilla = new Usabilla();
    });

    it('should have proper config on init', () => {
      expect(usabilla.config).toEqual({
        method: 'GET',
        host: 'data.usabilla.com',
        iterator: true
      });
    });
  });
});
