import invariant from 'invariant'

import conformsTo from 'lodash/conformsTo'
import defaults from 'lodash/defaults'
import isString from 'lodash/isString'
import isFinite from 'lodash/isFinite'
import isBoolean from 'lodash/isBoolean'
import isNil from 'lodash/isNil'

import * as types from '../types'

import * as constants from '../constants'
import * as sanitizers from './sanitizers'

export const clientOptions = (
  options: Partial<types.ClientOptions>,
): types.ClientOptions => {
  const shape = {
    username: (value: any) => isNil(value) || isString(value),
    token: (value: any) => isNil(value) || isString(value),
    server: isString,
    port: isFinite,
    ssl: isBoolean,
    isKnown: isBoolean,
    isVerified: isBoolean,
  }

  const optionsWithDefaults: types.ClientOptions = defaults(
    {
      ...options,
      username: sanitizers.username(options.username),
      token: options.token ? sanitizers.token(options.token) : undefined,
    },
    {
      server: constants.CHAT_SERVER,
      port: constants.CHAT_SERVER_SSL_PORT,
      ssl: true,
      isKnown: false,
      isVerified: false,
    },
  )

  invariant(
    conformsTo(optionsWithDefaults, shape),
    '[twitch-js/Chat/Client] options: Expected valid options',
  )

  return optionsWithDefaults
}
