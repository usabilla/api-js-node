const axios = require('axios');
const action = require('../lib/action');

jest.mock('axios');

describe('action', () => {
  let items;
  let apiOptions;
  let endpointOptions;
  let options;
  let expectedRequestOptions;

  beforeEach(() => {
    const DATE_TO_USE = new Date('2016');
    global.Date = jest.fn(() => DATE_TO_USE);

    items = [{ id: '1' }, { id: '2' }];
    apiOptions = { protocol: 'https', host: 'localhost', iterator: false };
    endpointOptions = { method: 'get', path: '/foo' };
    options = { value: 'bar' };
    expectedRequestOptions = {
      baseURL: 'https://localhost',
      headers: {
        Authorization:
          'USBL1-HMAC-SHA256 Credential=access-key/20160101/usbl1_request, SignedHeaders=host;x-ub-api-client;x-usbl-date, Signature=7f71ccd5a740b72a229f8f6aee0b738b9b4f1e5106efe51da785fa3574116f9b',
        host: 'data.usabilla.com',
        'x-ub-api-client': 'Usabilla API Node Client/undefined',
        'x-usbl-date': '20160101T000000Z'
      },
      method: 'get',
      url: '/foo'
    };
  });

  it('calls request with options and returns items', done => {
    axios.mockImplementation(() =>
      Promise.resolve({
        data: {
          items
        }
      })
    );

    action(apiOptions, endpointOptions, 'access-key', 'private-key', options)
      .then(result => {
        expect(result).toEqual(items);
        expect(axios).toHaveBeenCalledWith(expectedRequestOptions);
        done();
      })
      .catch(done.fail);
  });

  it('calls request with options and returns items with iteration', done => {
    const moreItems = [{ id: '3' }, { id: '4' }];
    apiOptions = Object.assign({}, apiOptions, { iterator: true });
    axios
      .mockImplementationOnce(() =>
        Promise.resolve({
          data: {
            items,
            hasMore: true,
            lastTimestamp: new Date('2017')
          }
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          data: {
            items: moreItems,
            hasMore: false
          }
        })
      );

    action(apiOptions, endpointOptions, 'access-key', 'private-key', options)
      .then(result => {
        expect(result).toEqual([...items, ...moreItems]);
        expect(axios).toHaveBeenCalledWith(expectedRequestOptions);
        done();
      })
      .catch(done.fail);
  });
});
