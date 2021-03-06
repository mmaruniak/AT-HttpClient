import HttpClient from './httpClient';

describe('createHeadersWithResolvedToken()', () => {
  test('adds a token', async () => {
    const testToken = 'unit-test-token';
    const tokenResolverFunctionMock = jest.fn().mockResolvedValue(testToken);

    const httpClient = new HttpClient({
      logFunction: () => {},
      tokenResolver: tokenResolverFunctionMock,
    });
    const generatedHeader = await httpClient.createHeadersWithResolvedToken({});

    expect(generatedHeader.Authorization).toEqual(`Bearer ${testToken}`);
  });

  test('errors when there is an auth header set', async () => {
    const testToken = 'unit-test-token';
    const tokenResolverFunctionMock = jest.fn().mockResolvedValue(testToken);

    const httpClient = new HttpClient({
      logFunction: () => {},
      tokenResolver: tokenResolverFunctionMock,
    });

    const headers = {
      Authorization: 'Bearer abc',
    };
    await expect(httpClient.createHeadersWithResolvedToken(headers)).rejects.toThrow(
      'Authorization header already specified, please create a new HttpClient with a different (or without a) tokenResolver',
    );
  });

  test("doesn't do anything if the tokenResolver is not present", async () => {
    const httpClient = new HttpClient();

    const headers = {};

    const generatedHeader = await httpClient.createHeadersWithResolvedToken(headers);

    expect(generatedHeader).toEqual(headers);
  });
});
