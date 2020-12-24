require('whatwg-fetch');

let fetch;

if (typeof global !== 'undefined' && typeof global.fetch !== 'undefined') {
  fetch = global.fetch;
} else if (typeof window !== 'undefined' && typeof window.fetch !== 'undefined') {
  fetch = window.fetch;
} else if (typeof self !== 'undefined' && typeof self.fetch !== 'undefined') {
  fetch = self.fetch;
}

module.exports = fetch;
