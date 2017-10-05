const SignatureFactory = require('./../src/signing.js');

describe('SignatureFactory', function() {
  beforeEach(function() {
    this.signatureFactory = new SignatureFactory('access', 'secret', 'host');
  });

  describe('setUrl', function() {
    it('sets a URL', function() {
      this.signatureFactory.setUrl('foobar');
      expect(this.signatureFactory.url).toEqual('foobar');
    });
  });

  describe('setMethod', function() {
    it('sets a Method', function() {
      this.signatureFactory.setMethod('foobar');
      expect(this.signatureFactory.method).toEqual('foobar');
    });
  });

  describe('setHeaders', function() {
    it('sets provided headers to instance headers', function() {
      //init
      this.signatureFactory.headers = { fooA: 'barA' };

      this.signatureFactory.setHeaders({ fooB: 'barB' });

      expect(this.signatureFactory.headers).toEqual({
        fooA: 'barA',
        fooB: 'barB'
      });
    });
  });

  describe('handleQuery', function() {
    it('should transform URL based on query with id', function() {
      this.signatureFactory.url = 'bar/:id/bar';
      let query = {
        id: 'foo'
      };

      this.signatureFactory.handleQuery(query);

      expect(this.signatureFactory.url).toEqual('bar/foo/bar');
    });

    it('should transform URL based on query without id', function() {
      this.signatureFactory.url = 'bar/:id/bar';
      let query = {};

      this.signatureFactory.handleQuery(query);

      expect(this.signatureFactory.url).toEqual('bar/:id/bar');
    });

    it('should transform URL based on query with star id', function() {
      this.signatureFactory.url = 'bar/:id/bar';
      let query = {
        id: '*'
      };

      this.signatureFactory.handleQuery(query);

      expect(this.signatureFactory.url).toEqual('bar/%2A/bar');
    });

    it('should transform URL based on query with star id', function() {
      this.signatureFactory.url = 'bar/:id/bar';
      let query = {
        params: {
          limit: 'foo',
          since: 'bar'
        }
      };

      this.signatureFactory.handleQuery(query);

      expect(this.signatureFactory.queryParameters).toEqual(
        'limit=foo&since=bar'
      );
    });
  });

  describe('getHeadersToSign', function() {
    //init
    beforeEach(function() {
      this.signatureFactory.headers = {
        fooB: 'barB',
        fooA: 'barA'
      };

      this.headers = this.signatureFactory.getHeadersToSign();
    });

    it('should add add host header', function() {
      expect(this.headers.hasOwnProperty('host')).toBeTruthy();
    });

    it('should delete possible cached Authorization header', function() {
      expect(this.headers.hasOwnProperty('Authorization')).toBeFalsy();
    });

    it('should sort headers alphabetically', function() {
      let expected = {
        fooA: 'barA',
        fooB: 'barB',
        host: 'data.usabilla.com'
      };
      expect(this.headers).toEqual(expected);
    });
  });

  describe('getCanonicalHeaders', function() {
    it('should getCanonicalHeaders', function() {
      //init
      this.signatureFactory.headers = {
        fooB: 'barB',
        fooA: 'barA'
      };

      let headers = this.signatureFactory.getCanonicalHeaders();

      expect(headers).toEqual('fooA:barA\nfooB:barB\nhost:data.usabilla.com\n');
    });
  });

  describe('getSignedHeaders', function() {
    it('should getSignedHeaders', function() {
      //init
      this.signatureFactory.headers = {
        fooB: 'barB',
        fooA: 'barA'
      };

      let headers = this.signatureFactory.getSignedHeaders();

      expect(headers).toEqual('fooA;fooB;host');
    });
  });

  describe('canonicalString', function() {
    it('returns the canonical string', function() {
      this.signatureFactory.method = 'GET';
      this.signatureFactory.url = 'url_foobar';
      let canonicalString = this.signatureFactory.canonicalString();

      expect(canonicalString).toEqual(
        [
          'GET',
          'url_foobar',
          '',
          'host:data.usabilla.com\n',
          'host',
          'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
        ].join('\n')
      );
    });
  });

  describe('getDateTime', function() {
    it('returns an object with "shortdate" and "longdate"', function() {
      let time = SignatureFactory.getDateTime();

      expect(time.hasOwnProperty('shortdate')).toBeTruthy();
      expect(time.hasOwnProperty('longdate')).toBeTruthy();
    });
  });

  describe('stringToSign', function() {
    it('returns the string to sign', function() {
      spyOn(SignatureFactory, 'hash').and.returnValue('foo');
      this.signatureFactory.dates = SignatureFactory.getDateTime();
      const stringToSign = this.signatureFactory.stringToSign();
      expect(stringToSign).toBe(
        [
          'USBL1-HMAC-SHA256',
          this.signatureFactory.dates.longdate,
          `${this.signatureFactory.dates.shortdate}/usbl1_request`,
          'foo'
        ].join('\n')
      );
    });
  });

  describe('getSignature', function() {
    it('calls SignatureFactory.hmac with the correct data', function() {
      spyOn(SignatureFactory, 'hmac');
      spyOn(this.signatureFactory, 'stringToSign').and.returnValue('bar');
      this.signatureFactory.dates = SignatureFactory.getDateTime();
      this.signatureFactory.getSignature();
      expect(SignatureFactory.hmac).toHaveBeenCalledTimes(3);
      expect(SignatureFactory.hmac).toHaveBeenCalledWith(
        'USBL1secret',
        this.signatureFactory.dates.shortdate
      );
      expect(SignatureFactory.hmac).toHaveBeenCalledWith(
        undefined,
        'usbl1_request'
      );
      expect(SignatureFactory.hmac).toHaveBeenCalledWith(
        undefined,
        'bar',
        'hex'
      );
    });
  });

  describe('authHeader', function() {
    it('returns the authorization header string', function() {
      spyOn(SignatureFactory, 'getDateTime').and.returnValue({
        longdate: 'foo',
        shortdate: 'bar'
      });
      spyOn(this.signatureFactory, 'getSignedHeaders').and.returnValue('baz');
      spyOn(this.signatureFactory, 'getSignature').and.returnValue('bax');
      const authHeader = this.signatureFactory.authHeader();
      expect(authHeader).toBe(
        [
          `USBL1-HMAC-SHA256 Credential=${this.signatureFactory
            .accessKey}/${this.signatureFactory.dates.shortdate}/usbl1_request`,
          'SignedHeaders=baz',
          'Signature=bax'
        ].join(', ')
      );
    });
  });

  describe('sign', function() {
    beforeEach(function() {
      this.signatureFactory.url = 'http://foo.bar';
    });

    it('returns object with headers that contain "Authorization"', function() {
      spyOn(this.signatureFactory, 'authHeader').and.returnValue('foo');
      const signed = this.signatureFactory.sign();
      expect(signed.headers.Authorization).toBe('foo');
    });

    it('returns object with the instance url if there no query parameters', function() {
      const signed = this.signatureFactory.sign();
      expect(signed.url).toBe('http://foo.bar');
    });

    it('returns object with url including the query parameters', function() {
      this.signatureFactory.queryParameters = 'baz=bax';
      const signed = this.signatureFactory.sign();
      expect(signed.url).toBe('http://foo.bar?baz=bax');
    });
  });
});
