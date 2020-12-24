let FormData;

if (typeof global !== 'undefined' && typeof global.FormData !== 'undefined') {
  FormData = global.FormData;
} else if (typeof window !== 'undefined' && typeof window.FormData !== 'undefined') {
  FormData = window.FormData;
} else if (typeof self !== 'undefined' && typeof self.FormData !== 'undefined') {
  FormData = self.FormData;
}

module.exports = FormData;
