import SignatureFactory from './signing';

describe('Signing', () => {
  describe('SignatureFactory', () => {
    let signatureFactory;

    signatureFactory = new SignatureFactory();

    it ('should set a URL', () => {
      signatureFactory.setUrl('foobar')
      expect(signatureFactory.url).toEqual('foobar');
    });

    it ('should set a Method', () => {
      signatureFactory.setMethod('foobar')
      expect(signatureFactory.method).toEqual('foobar');
    });

    it ('should set Headers', () => {
      //init
      signatureFactory.headers = {fooA: 'barA'};

      signatureFactory.setHeaders({fooB: 'barB'});

      expect(signatureFactory.headers).toEqual({fooA: 'barA', fooB: 'barB'});
    });

    describe('SignatureFactory', () => {
      //init
      signatureFactory.host = 'foobar';
      signatureFactory.headers = {
        fooB: 'barB',
        fooA: 'barA'
      };

      let headers = signatureFactory.getHeadersToSign();


      it ('should add add host header', () => {
        expect(headers.hasOwnProperty('host')).toBeTruthy()
      });

      it ('should delete possible cached Authorization header', () => {
        expect(headers.hasOwnProperty('Authorization')).toBeFalsy()
      });

      it ('should sort headers alphabetically', () => {
        let expected = {
          fooA: 'barA',
          fooB: 'barB',
          host: 'foobar'
        }
        expect(headers).toEqual(expected);
      });
    });

    it ('should getCanonicalHeaders', () => {
      //init
      signatureFactory.host = 'foobar';
      signatureFactory.headers = {
        fooB: 'barB',
        fooA: 'barA'
      };

      let headers = signatureFactory.getCanonicalHeaders();

      expect(headers).toEqual('fooA:barA\nfooB:barB\nhost:foobar\n');
    });

    it ('should getSignedHeaders', () => {
      //init
      signatureFactory.host = 'foobar';
      signatureFactory.headers = {
        fooB: 'barB',
        fooA: 'barA'
      };

      let headers = signatureFactory.getSignedHeaders();

      expect(headers).toEqual('fooA;fooB;host');
    });


  });
});
