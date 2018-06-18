const self = {
  // Return the second value if the first value is undefined..
  get: (obj1, obj2) => (typeof obj1 === 'undefined' ? obj2 : obj1),

  // Value is a boolean..
  isBoolean: obj => typeof obj === 'boolean',

  // Value is a finite number..
  isFinite: int => Number.isFinite(int) && !Number.isNaN(parseFloat(int)),

  // Value is an integer..
  isInteger: int => !Number.isNaN(self.toNumber(int, 0)),

  // Username is a justinfan username..
  isJustinfan: username => RegExp('^(justinfan)(\\d+$)', 'g').test(username),

  // Value is null..
  isNull: obj => obj === null,

  // Value is a regex..
  isRegex: str => /[\|\\\^\$\*\+\?\:\#]/.test(str),

  // Value is a string..
  isString: str => typeof str === 'string',

  // Value is a valid url..
  isURL: str =>
    RegExp(
      '^(?:(?:https?|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))\\.?)(?::\\d{2,5})?(?:[/?#]\\S*)?$',
      'i',
    ).test(str),

  // Return a random justinfan username..
  justinfan: () => `justinfan${Math.floor(Math.random() * 80000 + 1000)}`,

  // Return a valid password..
  password: str => {
    if (str === 'SCHMOOPIIE' || str === '' || str === null) {
      return 'SCHMOOPIIE';
    }
    return `oauth:${str.toLowerCase().replace('oauth:', '')}`;
  },

  // Race a promise against a delay..
  promiseDelay: time =>
    new Promise(resolve => {
      setTimeout(resolve, time);
    }),

  // Replace all occurences of a string using an object..
  replaceAll: (str, obj) => {
    if (str === null || typeof str === 'undefined') {
      return null;
    }
    Object.keys(obj).forEach(x => {
      str = str.replace(new RegExp(x, 'g'), obj[x]);
    });
    return str;
  },

  unescapeHtml: safe =>
    safe
      .replace(/\\&amp\\;/g, '&')
      .replace(/\\&lt\\;/g, '<')
      .replace(/\\&gt\\;/g, '>')
      .replace(/\\&quot\\;/g, '"')
      .replace(/\\&#039\\;/g, "'"),

  // Add word to a string..
  addWord: (line, word) => {
    if (line.length !== 0) {
      return `${line} ${word}`;
    }
    return word;
  },

  // Return a valid channel name..
  channel: str => {
    const channel = typeof str === 'undefined' || str === null ? '' : str;
    return channel.charAt(0) === '#'
      ? channel.toLowerCase()
      : `#${channel.toLowerCase()}`;
  },

  // Extract a number from a string..
  extractNumber: str => {
    const parts = str.split(' ');
    for (let i = 0; i < parts.length; i++) {
      if (self.isInteger(parts[i])) {
        return ~~parts[i];
      }
    }
    return 0;
  },

  // Format the date..
  formatDate: date => {
    let hours = date.getHours();
    let mins = date.getMinutes();

    hours = (hours < 10 ? '0' : '') + hours;
    mins = (mins < 10 ? '0' : '') + mins;

    return `${hours}:${mins}`;
  },

  // Inherit the prototype methods from one constructor into another..
  inherits: (ctor, superCtor) => {
    ctor.super_ = superCtor;
    const TempCtor = function() {};
    TempCtor.prototype = superCtor.prototype;
    ctor.prototype = new TempCtor();
    ctor.prototype.constructor = ctor;
  },

  // Return whether inside a Node application or not..
  isNode: () => {
    try {
      if (
        typeof process === 'object' &&
        Object.prototype.toString.call(process) === '[object process]'
      ) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  },

  isExtension: () => {
    try {
      if (window.chrome && window.chrome.runtime && window.chrome.runtime.id) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  },

  // Merge two or more objects.
  merge: Object.assign,

  // Split a line but don't cut a word in half..
  splitLine: (input, length) => {
    const lastSpace = input.substring(0, length).lastIndexOf(' ');
    return [input.substring(0, lastSpace), input.substring(lastSpace + 1)];
  },

  // Parse string to number. Returns NaN if string can't be parsed to number..
  toNumber: (num, precision) => {
    if (num === null) return 0;
    const factor = Math.pow(10, self.isFinite(precision) ? precision : 0);
    return Math.round(num * factor) / factor;
  },

  // Merge two arrays..
  union: (arr1, arr2) => {
    const hash = {};
    const ret = [];

    arr1.forEach(value => {
      if (!hash[value]) {
        hash[value] = true;
        ret.push(value);
      }
    });

    arr2.forEach(value => {
      if (!hash[value]) {
        hash[value] = true;
        ret.push(value);
      }
    });

    return ret;
  },

  // Return a valid username..
  username: str => {
    const username = typeof str === 'undefined' || str === null ? '' : str;
    return username.charAt(0) === '#'
      ? username.substring(1).toLowerCase()
      : username.toLowerCase();
  },
};

module.exports = self;
