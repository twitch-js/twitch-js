const conformsTo = require('lodash/conformsTo')
const isString = require('lodash/isString')

exports.preflight = () => {
  const shape = {
    USERNAME: isString,
    CLIENT_ID: isString,
    ACCESS_TOKEN: isString,
    REFRESH_TOKEN: isString,
  }

  if (!conformsTo(process.env, shape)) {
    throw new Error('Missing environment variable(s)')
  }
}
