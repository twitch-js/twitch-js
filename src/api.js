const request = require('request');
const _ = require('./utils');

const api = function api(options, callback) {
  // Set the url to options.uri or options.url..
  let url = _.get(options.url, null) === null ? _.get(options.uri, null) : _.get(options.url, null);

  // Make sure it is a valid url..
  if (!_.isURL(url)) { url = url.charAt(0) === '/' ? `https://api.twitch.tv/kraken${url}` : `https://api.twitch.tv/kraken/${url}`; }

  // We are inside a Node application, so we can use the request module..
  if (_.isNode()) {
    request(_.merge({ url, method: 'GET', json: true }, options), (err, res, body) => {
      callback(err, res, body);
    });
  } else if (_.isExtension()) {
    // Inside an extension -> we cannot use jsonp!
    const xhrOptions = _.merge(options, { url, method: 'GET', headers: {} });
    // prepare request
    const xhr = new XMLHttpRequest();
    xhr.open(xhrOptions.method, xhrOptions.url, true);
    Object.keys(xhrOptions)
      .forEach(name => xhr.setRequestHeader(name, xhrOptions.headers[name]));
    xhr.responseType = 'json';
    // set request handler
    xhr.addEventListener('load', () => {
      if (xhr.readyState === 4) {
        if (xhr.status !== 200) {
          callback(xhr.status, null, null);
        } else {
          callback(null, null, xhr.response);
        }
      }
    });
    // submit
    xhr.send();
  } else {
    // Inside a web application, use jsonp..
    // Callbacks must match the regex [a-zA-Z_$][\w$]*(\.[a-zA-Z_$][\w$]*)*
    const script = document.createElement('script');

    const callbackName = `jsonp_callback_${Math.round(100000 * Math.random())}`;
    window[callbackName] = (data) => {
      delete window[callbackName];
      document.body.removeChild(script);
      callback(null, null, data);
    };

    // Inject the script in the document..
    script.src = `${url}${url.indexOf('?') >= 0 ? '&' : '?'}callback=${callbackName}`;
    document.body.appendChild(script);
  }
};

module.exports = api;
