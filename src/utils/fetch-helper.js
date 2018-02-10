import fetchFn from 'node-fetch';

export const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(`${response.url} ${response.statusText}`);
  error.response = response;
  throw error;
};

export const parseJson = response => response.json();

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

  return fetchFn(endpoint, {
    ...otherProps,
    method,
    headers: {
      ...headers,
      Accept: 'application/vnd.twitchtv.v5+json',
    },
  })
    .then(checkStatus)
    .then(parseJson);
};
