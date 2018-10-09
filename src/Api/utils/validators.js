import invariant from 'invariant'
import {
  conformsTo,
  defaultsDeep,
  isBoolean,
  isFunction,
  isString,
} from 'lodash'

const apiOptions = maybeOptions => {
  /**
   * API options
   * @typedef {Object} ApiOptions
   * @property {string} [clientId] Optional if token is defined.
   * @property {string} [token] Optional if clientId is defined.
   * @property {boolean} [debug=false]
   * @property {function} [onAuthenticationFailure]
   *
   */
  const shape = {
    debug: isBoolean,
    onAuthenticationFailure: isFunction,
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
      debug: false,
      onAuthenticationFailure: () => Promise.reject(),
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
