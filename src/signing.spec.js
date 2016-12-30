import SignatureFactory from './signing';

describe('Usabilla API Node Client', () => {
  describe('SignatureFactory', () => {
    let signatureFactory;

    beforeEach(() => {
      signatureFactory = new SignatureFactory();
    });

    it ('new', () => {
      expect(true).toEqual(true);
    });

  });
});
