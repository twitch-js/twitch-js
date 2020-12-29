import invariant from 'invariant'

import conformsTo from 'lodash/conformsTo'
import defaults from 'lodash/defaults'
import isFunction from 'lodash/isFunction'
import isString from 'lodash/isString'
import isUndefined from 'lodash/isUndefined'

import { ApiOptions } from '../types'

export const apiOptions = (options: Partial<ApiOptions>): ApiOptions => {
  const shape = {
    token: isString,
    clientId: (clientId: unknown) =>
      isString(clientId) || isUndefined(clientId),
    onAuthenticationFailure: (cb: unknown) => isFunction(cb) || isUndefined(cb),
  }

  options = defaults(options, {
    clientId: undefined,
    onAuthenticationFailure: undefined,
  })

  invariant(conformsTo(options, shape), 'Expected valid options')

  return options as ApiOptions
}
