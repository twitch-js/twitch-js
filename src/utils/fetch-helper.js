import fetchFn from 'node-fetch';

export const parseResponse = response =>
  response.json().then(json => {
    if (!response.ok) {
      const error = new Error(`${response.url} ${response.statusText}`);
      error.response = json;
      throw error;
    }

    return json;
  });

export default ({
  endpoint,
  method = 'GET',
  clientId,
  token,
  ...otherProps
} = {}) => {
  if (!endpoint) {
    return Promise.reject(new Error('An endpoint is required.'));
  }

  if (!clientId && !token) {
    return Promise.reject(new Error('A client ID or token is required.'));
  }

  // Construct headers object.
  const headers = token
    ? { Authorization: `OAuth ${token}` }
    : { 'Client-ID': clientId };

  // Construct options object.
  const options = {
    ...otherProps,
    method,
    headers: {
      ...headers,
      Accept: 'application/vnd.twitchtv.v5+json',
    },
  };

  return fetchFn(endpoint, options).then(parseResponse);
};
