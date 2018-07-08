import invariant from 'invariant'
import { conformsTo, defaultsDeep, isBoolean, isString } from 'lodash'

import * as constants from '../constants'

const apiOptions = maybeOptions => {
  /**
   * API options
   * @typedef {Object} ApiOptions
   * @property {string} [clientId] Optional if token is defined.
   * @property {string} [token] Optional if clientId is defined.
   * @property {string} [urlRoot]
   * @property {boolean} [debug=false]
   */
  const shape = {
    debug: isBoolean,
  }

  const shapeWithClientId = {
    ...shape,
    clientId: isString,
  }

  const shapeWithToken = {
    ...shape,
    token: isString,
  }

  const options = defaultsDeep(
    {},
    { ...maybeOptions },
    {
      urlRoot: constants.KRAKEN_URL_ROOT,
      debug: false,
    },
  )

  invariant(
    conformsTo(options, shapeWithClientId) ||
      conformsTo(options, shapeWithToken),
    '[twitch-js/Api] options: Expected valid options',
  )

  return options
}

export { apiOptions }
