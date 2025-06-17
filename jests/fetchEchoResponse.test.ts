import { fetchEchoResponse } from '../src/echoAPI';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      choices: [
        { message: { content: 'Mocked Echo response' } }
      ]
    })
  })
) as jest.Mock;

describe('fetchEchoResponse', () => {
  it('returns the expected message', async () => {
    const result = await fetchEchoResponse('Hello?', 'fake-key');
    expect(result).toBe('Mocked Echo response');
  });
});