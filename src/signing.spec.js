const SignatureFactory = require('./../src/signing.js');

describe('Signing', () => {

  describe('SignatureFactory', () => {

    beforeEach(() => {
      this.signatureFactory = new SignatureFactory();
    })

    it ('should set a URL', () => {
      this.signatureFactory.  setUrl('foobar')
      expect(this.signatureFactory.  url).toEqual('foobar');
    });

    it ('should set a Method', () => {
      this.signatureFactory.  setMethod('foobar')
      expect(this.signatureFactory.  method).toEqual('foobar');
    });

    it ('should set Headers', () => {
      //init
      this.signatureFactory.  headers = {fooA: 'barA'};

      this.signatureFactory.  setHeaders({fooB: 'barB'});

      expect(this.signatureFactory.  headers).toEqual({fooA: 'barA', fooB: 'barB'});
    });

    describe('handleQuery', () => {

      it ('should transform URL based on query with id', () => {
        this.signatureFactory.  url = 'bar/:id/bar'
        let query = {
          id: 'foo'
        }

        this.signatureFactory.  handleQuery(query);

        expect(this.signatureFactory.  url).toEqual('bar/foo/bar');
      });

      it ('should transform URL based on query without id', () => {
        this.signatureFactory.  url = 'bar/:id/bar'
        let query = {
        }

        this.signatureFactory.  handleQuery(query);

        expect(this.signatureFactory.  url).toEqual('bar/:id/bar');
      });

      it ('should transform URL based on query with star id', () => {
        this.signatureFactory.  url = 'bar/:id/bar'
        let query = {
          id: '*'
        }

        this.signatureFactory.  handleQuery(query);

        expect(this.signatureFactory.  url).toEqual('bar/%2A/bar');
      });

      it ('should transform URL based on query with star id', () => {
        this.signatureFactory.  url = 'bar/:id/bar'
        let query = {
          params: {
            limit: 'foo',
            since: 'bar'
          }
        }

        this.signatureFactory.  handleQuery(query);

        expect(this.signatureFactory.  queryParameters).toEqual('limit=foo&since=bar');
      });

    });


    describe('getHeadersToSign', () => {
      let headers;

      //init
      beforeEach(() => {
        this.signatureFactory.  host = 'foobar';
        this.signatureFactory.  headers = {
          fooB: 'barB',
          fooA: 'barA'
        };

        headers = this.signatureFactory.  getHeadersToSign();
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

    it ('should getCanonicalHeaders', () => {
      //init
      this.signatureFactory.  host = 'foobar';
      this.signatureFactory.  headers = {
        fooB: 'barB',
        fooA: 'barA'
      };

      let headers = this.signatureFactory.  getCanonicalHeaders();

      expect(headers).toEqual('fooA:barA\nfooB:barB\nhost:foobar\n');
    });

    it ('should getSignedHeaders', () => {
      //init
      this.signatureFactory.  host = 'foobar';
      this.signatureFactory.  headers = {
        fooB: 'barB',
        fooA: 'barA'
      };

      let headers = this.signatureFactory.  getSignedHeaders();

      expect(headers).toEqual('fooA;fooB;host');
    });

    it ('should canonicalString', () => {
      this.signatureFactory.  method = 'GET';
      this.signatureFactory.  url = 'url_foobar';
      this.signatureFactory.  host = 'host_foobar';
      let canonicalString = this.signatureFactory.  canonicalString();

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
      let time = this.signatureFactory.  getDateTime();

      expect(time.hasOwnProperty('usbldate')).toBeTruthy()
      expect(time.hasOwnProperty('shortdate')).toBeTruthy()
      expect(time.hasOwnProperty('longdate')).toBeTruthy()

    });


  });
});
