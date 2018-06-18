import nodeFetch from 'node-fetch';
import fetchHelper, { parseResponse } from '../fetch-helper';

const jsonResponseMock = { data1: 'DATA_1' };
const responseMock = {
  status: 200,
  ok: true,
  url: 'URL',
  statusText: 'OK',
  json: () => Promise.resolve(jsonResponseMock),
};

const jsonResponseErrorMock = { error: true };
const responseErrorMock = {
  status: 404,
  ok: false,
  url: 'URL',
  statusText: 'NOT OK',
  json: () => Promise.resolve({ jsonResponseErrorMock }),
};

jest.mock('node-fetch');
nodeFetch.mockImplementation(jest.fn(() => Promise.resolve(responseMock)));

const optionsWithClientId = {
  endpoint: 'ENDPOINT',
  clientId: 'CLIENT_ID',
};

const optionsWithToken = {
  endpoint: 'ENDPOINT',
  token: 'TOKEN',
};

describe('utils/fetch-helper', () => {
  describe('parseResponse', () => {
    test('should return response on successful response', () => {
      const actual = parseResponse(responseMock);
      const expected = jsonResponseMock;

      expect(actual).resolves.toEqual(expected);
    });

    test('should throw on unsuccessful response', () => {
      const actual = parseResponse(responseErrorMock);

      expect(actual).rejects.toBeInstanceOf(Error);
    });
  });

  describe('fetchHelper', () => {
    test('should reject if endpoint is missing', () => {
      expect.assertions(1);

      const actual = fetchHelper();

      return expect(actual).rejects.toBeInstanceOf(Error);
    });

    test('should reject if clientId and token are missing', () => {
      expect.assertions(1);

      const actual = fetchHelper({ endpoint: 'endpoint' });

      return expect(actual).rejects.toBeInstanceOf(Error);
    });

    test('should resolve if endpoint and clientId are provided', () => {
      expect.assertions(1);

      const actual = fetchHelper(optionsWithClientId);
      const expected = jsonResponseMock;

      return expect(actual).resolves.toEqual(expected);
    });

    test('should resolve if endpoint and token are provided', () => {
      expect.assertions(1);

      const actual = fetchHelper(optionsWithToken);
      const expected = jsonResponseMock;

      return expect(actual).resolves.toEqual(expected);
    });
  });
});
