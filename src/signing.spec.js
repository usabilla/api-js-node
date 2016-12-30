const SignatureFactory = require('./../src/signing.js');

describe('Signing', () => {

  describe('SignatureFactory', () => {

    beforeEach(() => {
      signatureFactory = new SignatureFactory();
    })

    it ('should set a URL', () => {
      signatureFactory.setUrl('foobar')
      expect(signatureFactory.url).toEqual('foobar');
    });

    it ('should set a Method', () => {
      signatureFactory.setMethod('foobar')
      expect(signatureFactory.method).toEqual('foobar');
    });

    xit ('should set Headers', () => {
      //init
      signatureFactory.headers = {fooA: 'barA'};

      signatureFactory.setHeaders({fooB: 'barB'});

      expect(signatureFactory.headers).toEqual({fooA: 'barA', fooB: 'barB'});
    });

    xdescribe('handleQuery', () => {

      it ('should transform URL based on query with id', () => {
        signatureFactory.url = 'bar/:id/bar'
        let query = {
          id: 'foo'
        }

        signatureFactory.handleQuery(query);

        expect(signatureFactory.url).toEqual('bar/foo/bar');
      });

      it ('should transform URL based on query without id', () => {
        signatureFactory.url = 'bar/:id/bar'
        let query = {
        }

        signatureFactory.handleQuery(query);

        expect(signatureFactory.url).toEqual('bar/:id/bar');
      });

      it ('should transform URL based on query with star id', () => {
        signatureFactory.url = 'bar/:id/bar'
        let query = {
          id: '*'
        }

        signatureFactory.handleQuery(query);

        expect(signatureFactory.url).toEqual('bar/%2A/bar');
      });

      it ('should transform URL based on query with star id', () => {
        signatureFactory.url = 'bar/:id/bar'
        let query = {
          params: {
            limit: 'foo',
            since: 'bar'
          }
        }

        signatureFactory.handleQuery(query);

        expect(signatureFactory.queryParameters).toEqual('limit=foo&since=bar');
      });
    });

    xdescribe('getHeadersToSign', () => {
      let headers;

      //init
      beforeEach(() => {
        signatureFactory.host = 'foobar';
        signatureFactory.headers = {
          fooB: 'barB',
          fooA: 'barA'
        };

        headers = signatureFactory.getHeadersToSign();
      })

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

    xit ('should getCanonicalHeaders', () => {
      //init
      signatureFactory.host = 'foobar';
      signatureFactory.headers = {
        fooB: 'barB',
        fooA: 'barA'
      };

      let headers = signatureFactory.getCanonicalHeaders();

      expect(headers).toEqual('fooA:barA\nfooB:barB\nhost:foobar\n');
    });

    xit ('should getSignedHeaders', () => {
      //init
      signatureFactory.host = 'foobar';
      signatureFactory.headers = {
        fooB: 'barB',
        fooA: 'barA'
      };

      let headers = signatureFactory.getSignedHeaders();

      expect(headers).toEqual('fooA;fooB;host');
    });

    xit ('should canonicalString', () => {
      signatureFactory.method = 'GET';
      signatureFactory.url = 'url_foobar';
      signatureFactory.host = 'host_foobar';
      let canonicalString = signatureFactory.canonicalString();

      expect(canonicalString).toEqual([
        'GET',
        'url_foobar',
        '',
        'host:host_foobar\n',
        'host',
        'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
        ].join('\n'));
    });


    it ('should getDateTime', () => {
      //FIX ME
      let time = signatureFactory.getDateTime();

      expect(time.hasOwnProperty('usbldate')).toBeTruthy()
      expect(time.hasOwnProperty('shortdate')).toBeTruthy()
      expect(time.hasOwnProperty('longdate')).toBeTruthy()
    });
  });
});
