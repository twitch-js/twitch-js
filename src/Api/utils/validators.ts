import invariant from 'invariant'
import { conformsTo, defaultsDeep, isFunction, isString } from 'lodash'

import { Options } from '../types'

export const apiOptions = (maybeOptions: any): Options | never => {
  /**
   * API options
   * @typedef {Object} ApiOptions
   * @property {string} [clientId] Optional if token is defined.
   * @property {string} [token] Optional if clientId is defined.
   * @property {Object} [log] Log options
   * @property {function} [onAuthenticationFailure]
   */
  const shape = {
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
      onAuthenticationFailure: () => Promise.reject(),
    },
  )

  invariant(
    conformsTo(options, shapeWithClientId) ||
      conformsTo(options, shapeWithToken),
    '[twitch-js/Api] options: Expected valid options',
  )

  return options as Options
}
