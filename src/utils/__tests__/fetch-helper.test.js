import nodeFetch from 'node-fetch';
import fetchHelper, { checkStatus, parseJson } from '../fetch-helper';

const mockJson = { data1: 'DATA_1' };

const mockResponse = {
  status: 200,
  json: jest.fn(() => Promise.resolve(mockJson)),
};

jest.mock('node-fetch');
nodeFetch.mockImplementation(jest.fn(() => Promise.resolve(mockResponse)));

const optionsWithClientId = {
  endpoint: 'ENDPOINT',
  clientId: 'CLIENT_ID',
};

const optionsWithToken = {
  endpoint: 'ENDPOINT',
  token: 'TOKEN',
};

describe('utils/fetch-helper', () => {
  describe('checkStatus', () => {
    test('should return response on successful response', () => {
      expect(checkStatus(mockResponse)).toEqual(mockResponse);
    });

    test('should throw on unsuccessful response', () => {
      expect(() => checkStatus({ ...mockResponse, status: 404 })).toThrow();
    });
  });

  describe('parseJson', () => {
    test('should call json on response', () => {
      parseJson(mockResponse);

      expect(mockResponse.json).toHaveBeenCalled();
    });
  });

  describe('fetchHelper', () => {
    test('should reject if endpoint is missing', () => {
      expect.assertions(1);
      return expect(fetchHelper())
        .rejects
        .toThrow();
    });

    test('should reject if clientId and token are missing', () => {
      expect.assertions(1);

      return expect(fetchHelper({ endpoint: 'endpoint' }))
        .rejects
        .toThrow();
    });

    test('should resolve if endpoint and clientId are provided', () => {
      expect.assertions(1);

      return expect(fetchHelper(optionsWithClientId))
        .resolves
        .toEqual(mockJson);
    });

    test('should resolve if endpoint and token are provided', () => {
      expect.assertions(1);

      return expect(fetchHelper(optionsWithToken))
        .resolves
        .toEqual(mockJson);
    });
  });
});
