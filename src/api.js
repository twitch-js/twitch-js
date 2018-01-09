const _ = require('./utils');
const request = (url, options) => _.isNode() ? require('./fetch')(url, options) : fetch(url, options);
const api = function api(options, callback) {

  // Set the url to options.uri or options.url..
  let url = _.get(options.url, null) === null ? _.get(options.uri, null) : _.get(options.url, null);

  // Make sure it is a valid url..
  if (!_.isURL(url)) { url = url.charAt(0) === '/' ? `https://api.twitch.tv/kraken${url}` : `https://api.twitch.tv/kraken/${url}`; }

  // If a callback is supplied, consume the promise and turn it into a callback (legacy preservation). Otherwise return a promise
  if (!!callback && typeof callback === 'function')  {
    let next = (global.process && process.nextTick) || global.setImmediate || function (f) { setTimeout(f, 0) };
    request(url, options)
      .then(result => result.json().then(json => next(function () { callback(null, result, json) })))
      .catch(err => next(function () { callback(err) }))
    return undefined;
  } else {
    return request(url, options);
  }
};

module.exports = api;
