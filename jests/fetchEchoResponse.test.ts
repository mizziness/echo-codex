import { fetchEchoResponse } from '../src/echoAPI';
import { PERSONAS } from '../src/personaTypes';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      choices: [
        { message: { content: 'Mocked Echo response' } }
      ]
    })
  })
) as jest.Mock;

const mockFetchResponse = (content: string) => {
  (global.fetch as jest.Mock).mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve({
        choices: [{ message: { content } }],
      }),
    })
  );
};

describe('fetchEchoResponse', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sends the persona in the request body', async () => {
    mockFetchResponse('Here is your joke, heretic.');
    const result = await fetchEchoResponse('Tell me a joke.', 'fake-key', PERSONAS.ECHO_DAEMON);

    expect(fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
      body: expect.stringContaining('Echo'),
    }));
    expect(result).toBe('Here is your joke, heretic.');
  });

  it('returns the expected message', async () => {
    mockFetchResponse('Mocked Echo response');
    const result = await fetchEchoResponse('Hello?', 'fake-key', PERSONAS.ECHO_DAEMON);
    expect(result).toBe('Mocked Echo response');
  });

  it('handles fetch failures gracefully', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error('Fetch failed'))
    );

    await expect(
      fetchEchoResponse('Test failed successfully', 'fake-key', PERSONAS.ECHO_DAEMON)
    ).rejects.toThrow('Fetch failed');
  });

  it('returns fallback when response structure is unexpected', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ choices: [] }),
      })
    );

    const result = await fetchEchoResponse('Bad API Structure', 'fake-key', PERSONAS.ECHO_DAEMON);
    expect(result).toBe('Echo responds with silence.');
  });
});
