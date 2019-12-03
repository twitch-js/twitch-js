import invariant from 'invariant'

import conformsTo from 'lodash/conformsTo'
import defaults from 'lodash/defaults'
import isFunction from 'lodash/isFunction'
import isString from 'lodash/isString'
import isUndefined from 'lodash/isUndefined'

import { Options } from '../types'

export const apiOptions = (maybeOptions: any): Options | never => {
  const shape = {
    clientId: (token: unknown) => isUndefined(token) || isString(token),
    token: (token: unknown) => isUndefined(token) || isString(token),
    onAuthenticationFailure: isFunction,
  }

  const options = defaults<Options, Options>(
    { ...maybeOptions },
    {
      clientId: undefined,
      token: undefined,
      onAuthenticationFailure: () => new Promise((_, reject) => reject()),
    },
  )

  invariant(
    conformsTo(options, shape),
    '[twitch-js/Api] options: Expected valid options',
  )

  return options as Options
}
