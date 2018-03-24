import { get, isFunction } from 'lodash';
import isURL from 'validator/lib/isURL';

import fetchHelper from './utils/fetch-helper';

const api = async (options = {}, cb) => {
  // Set the url to options.uri or options.url.
  const urlFromOptions = options.url || options.uri;

  const endpoint = isURL(urlFromOptions)
    ? urlFromOptions
    : `https://api.twitch.tv/kraken/${urlFromOptions.replace(/^\//, '')}`;

  const clientId = get(options, 'headers.Client-ID');
  const tokenWithOauth = get(options, 'headers.Authorization');

  const body = await fetchHelper({
    endpoint,
    clientId,
    token: tokenWithOauth ? tokenWithOauth.replace(/^Oauth /i, '') : undefined,
  });

  if (isFunction(cb)) {
    // For now, match the existing API's non-standard callback pattern.
    return cb(false, null, body);
  }

  return body;
};

module.exports = api;
