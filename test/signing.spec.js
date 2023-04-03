const { SignatureFactory } = require('../lib/signing');

describe('SignatureFactory', () => {
  let signatureFactory;

  beforeEach(() => {
    signatureFactory = new SignatureFactory('access', 'secret', 'host');
  });

  describe('setUrl', () => {
    it('sets a URL', () => {
      signatureFactory.setUrl('foobar');
      expect(signatureFactory.url).toEqual('foobar');
    });
  });

  describe('setMethod', () => {
    it('sets a Method', () => {
      signatureFactory.setMethod('foobar');
      expect(signatureFactory.method).toEqual('foobar');
    });
  });

  describe('setHeaders', () => {
    it('sets provided headers to instance headers', () => {
      //init
      signatureFactory.headers = { fooA: 'barA' };

      signatureFactory.setHeaders({ fooB: 'barB' });

      expect(signatureFactory.headers).toEqual({
        fooA: 'barA',
        fooB: 'barB',
      });
    });
  });

  describe('handleQuery', () => {
    it('should transform URL based on query with id', () => {
      signatureFactory.url = 'bar/:id/bar';
      let query = {
        id: 'foo',
      };

      signatureFactory.handleQuery(query);

      expect(signatureFactory.url).toEqual('bar/foo/bar');
    });

    it('should transform URL based on query without id', () => {
      signatureFactory.url = 'bar/:id/bar';
      let query = {};

      signatureFactory.handleQuery(query);

      expect(signatureFactory.url).toEqual('bar/:id/bar');
    });

    it('should transform URL based on query with star id', () => {
      signatureFactory.url = 'bar/:id/bar';
      let query = {
        id: '*',
      };

      signatureFactory.handleQuery(query);

      expect(signatureFactory.url).toEqual('bar/%2A/bar');
    });

    it('should transform URL based on query with params', () => {
      signatureFactory.url = 'bar/:id/bar';
      let query = {
        params: {
          limit: 'foo',
          since: 'bar',
        },
      };

      signatureFactory.handleQuery(query);

      expect(signatureFactory.queryParameters).toEqual('limit=foo&since=bar');
    });
  });

  describe('getHeadersToSign', () => {
    let headers;

    beforeEach(() => {
      signatureFactory.headers = {
        fooB: 'barB',
        fooA: 'barA',
      };

      headers = signatureFactory.getHeadersToSign();
    });

    it('should add add host header', () => {
      expect(
        Object.prototype.hasOwnProperty.call(headers, 'host')
      ).toBeTruthy();
    });

    it('should delete possible cached Authorization header', () => {
      expect(
        Object.prototype.hasOwnProperty.call(headers, 'Authorization')
      ).toBeFalsy();
    });

    it('should sort headers alphabetically', () => {
      let expected = {
        fooA: 'barA',
        fooB: 'barB',
        host: 'data.usabilla.com',
      };
      expect(headers).toEqual(expected);
    });
  });

  describe('getCanonicalHeaders', () => {
    it('should getCanonicalHeaders', () => {
      //init
      signatureFactory.headers = {
        fooB: 'barB',
        fooA: 'barA',
      };

      let headers = signatureFactory.getCanonicalHeaders();

      expect(headers).toEqual('fooA:barA\nfooB:barB\nhost:data.usabilla.com\n');
    });
  });

  describe('getSignedHeaders', () => {
    it('should getSignedHeaders', () => {
      //init
      signatureFactory.headers = {
        fooB: 'barB',
        fooA: 'barA',
      };

      let headers = signatureFactory.getSignedHeaders();

      expect(headers).toEqual('fooA;fooB;host');
    });
  });

  describe('canonicalString', () => {
    it('returns the canonical string', () => {
      signatureFactory.method = 'GET';
      signatureFactory.url = 'url_foobar';
      let canonicalString = signatureFactory.canonicalString();

      expect(canonicalString).toEqual(
        [
          'GET',
          'url_foobar',
          '',
          'host:data.usabilla.com\n',
          'host',
          'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        ].join('\n')
      );
    });
  });

  describe('getDateTime', () => {
    it('returns an object with "shortdate" and "longdate"', () => {
      let time = SignatureFactory.getDateTime();

      expect(
        Object.prototype.hasOwnProperty.call(time, 'shortdate')
      ).toBeTruthy();
      expect(
        Object.prototype.hasOwnProperty.call(time, 'longdate')
      ).toBeTruthy();
    });
  });

  describe('stringToSign', () => {
    it('returns the string to sign', () => {
      SignatureFactory.hash = jest.fn().mockReturnValue('foo');
      signatureFactory.dates = SignatureFactory.getDateTime();
      const stringToSign = signatureFactory.stringToSign();
      expect(stringToSign).toBe(
        [
          'USBL1-HMAC-SHA256',
          signatureFactory.dates.longdate,
          `${signatureFactory.dates.shortdate}/usbl1_request`,
          'foo',
        ].join('\n')
      );
    });
  });

  describe('getSignature', () => {
    it('calls SignatureFactory.hmac with the correct data', () => {
      SignatureFactory.hmac = jest.fn();
      signatureFactory.stringToSign = jest.fn().mockReturnValue('bar');
      signatureFactory.dates = SignatureFactory.getDateTime();
      signatureFactory.getSignature();
      expect(SignatureFactory.hmac).toHaveBeenCalledTimes(3);
      expect(SignatureFactory.hmac).toHaveBeenCalledWith(
        'USBL1secret',
        signatureFactory.dates.shortdate
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

  describe('authHeader', () => {
    it('returns the authorization header string', () => {
      SignatureFactory.getDateTime = jest.fn().mockReturnValue({
        longdate: 'foo',
        shortdate: 'bar',
      });
      signatureFactory.getSignedHeaders = jest.fn().mockReturnValue('baz');
      signatureFactory.getSignature = jest.fn().mockReturnValue('bax');
      const authHeader = signatureFactory.authHeader();
      expect(authHeader).toBe(
        [
          `USBL1-HMAC-SHA256 Credential=${signatureFactory.accessKey}/${signatureFactory.dates.shortdate}/usbl1_request`,
          'SignedHeaders=baz',
          'Signature=bax',
        ].join(', ')
      );
    });
  });

  describe('sign', () => {
    beforeEach(() => {
      signatureFactory.url = 'http://foo.bar';
    });

    it('returns object with headers that contain "Authorization"', () => {
      signatureFactory.authHeader = jest.fn().mockReturnValue('foo');
      const signed = signatureFactory.sign();
      expect(signed.headers.Authorization).toBe('foo');
    });

    it('returns object with the instance url if there no query parameters', () => {
      const signed = signatureFactory.sign();
      expect(signed.url).toBe('http://foo.bar');
    });

    it('returns object with url including the query parameters', () => {
      signatureFactory.queryParameters = 'baz=bax';
      const signed = signatureFactory.sign();
      expect(signed.url).toBe('http://foo.bar?baz=bax');
    });
  });
});
