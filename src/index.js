/* eslint-disable no-extend-native */

const client = require('./client');

// Provide support for < Chrome 41 mainly due to CLR Browser..
if (typeof String.prototype.includes !== 'function') {
  String.prototype.includes = () =>
    String.prototype.indexOf.apply(this, arguments) !== -1;
}

if (typeof String.prototype.startsWith !== 'function') {
  String.prototype.startsWith = (a, b) =>
    String.prototype.indexOf(a, b || 0) === b;
}

if (typeof Object.setPrototypeOf !== 'function') {
  Object.setPrototypeOf = (obj, proto) => {
    // eslint-disable-next-line no-proto
    obj.__proto__ = proto;
    return obj;
  };
}

module.exports = {
  client,
  Client: client,
};
