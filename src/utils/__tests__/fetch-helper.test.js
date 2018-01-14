import nodeFetch from 'node-fetch';
import fetchHelper from '../fetch-helper';

const mockResponse = { _id: '44322889' };

jest.mock('node-fetch');
nodeFetch.mockImplementation(() => Promise.resolve(mockResponse));

const optionsWithClientId = {
  endpoint: 'ENDPOINT',
  clientId: 'CLIENT_ID',
};

const optionsWithToken = {
  endpoint: 'ENDPOINT',
  token: 'TOKEN',
};

describe('utils/fetch-helper', () => {
  test('should reject if endpoint is missing', () => {
    expect.assertions(1);
    return expect(fetchHelper())
      .rejects
      .toThrow('An endpoint is required.');
  });

  test('should reject if clientId and token are missing', () => {
    expect.assertions(1);

    return expect(fetchHelper({ endpoint: 'endpoint' }))
      .rejects
      .toThrow('A client ID or token is required.');
  });

  test('should resolve if endpoint and clientId are provided', () => {
    expect.assertions(1);

    return expect(fetchHelper(optionsWithClientId))
      .resolves
      .toEqual(mockResponse);
  });

  test('should resolve if endpoint and token are provided', () => {
    expect.assertions(1);

    return expect(fetchHelper(optionsWithToken))
      .resolves
      .toEqual(mockResponse);
  });
});
