const ClientError = require('../lib/error');

describe('ClientError', () => {
  let dateToUse;

  beforeEach(() => {
    dateToUse = new Date('2016');
    global.Date = jest.fn(() => dateToUse);
    global.Date.now = jest.fn().mockReturnValue(dateToUse.valueOf());
  });

  it('returns error with timestamp and empty error message when given raw is empty object', () => {
    const error = new ClientError();
    expect(error.message).toBe('');
    expect(error.timestamp).toBe(dateToUse.valueOf());
  });

  it('returns error with timestamp and error message given raw error', () => {
    const error = new ClientError({
      response: {
        data: {
          error: {
            message: 'foo'
          }
        }
      }
    });
    expect(error.message).toBe('foo');
    expect(error.timestamp).toBe(dateToUse.valueOf());
  });
});
