import { get, isFunction } from 'lodash';
import isURL from 'validator/lib/isURL';

import fetchHelper from './utils/fetch-helper';

const api = async (options = {}, cb) => {
  // Set the url to options.uri or options.url.
  const urlFromOptions = options.url || options.uri;

  const url = isURL(urlFromOptions)
    ? urlFromOptions
    : `https://api.twitch.tv/kraken/${urlFromOptions.replace(/^\//, '')}`;

  const body = await fetchHelper({
    endpoint: url,
    clientId: get(options, 'headers.Client-ID'),
  });

  if (isFunction(cb)) {
    // For now, match the existing API's non-standard callback pattern.
    return cb(false, null, body);
  }

  return body;
};

module.exports = api;
