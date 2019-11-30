import invariant from 'invariant'

import conformsTo from 'lodash-es/conformsTo'
import defaults from 'lodash-es/defaults'
import isString from 'lodash-es/isString'
import isFinite from 'lodash-es/isFinite'
import isFunction from 'lodash-es/isFunction'
import isBoolean from 'lodash-es/isBoolean'
import isNil from 'lodash-es/isNil'

import * as types from '../types'

import * as constants from '../constants'
import * as sanitizers from './sanitizers'

export const chatOptions = (maybeOptions: types.Options): types.Options => {
  const shape = {
    username: isString,
    token: (value: any) => isNil(value) || isString(value),
    isKnown: isBoolean,
    isVerified: isBoolean,
    connectionTimeout: isFinite,
    joinTimeout: isFinite,
    onAuthenticationFailure: isFunction,
  }

  const options: types.Options = defaults(
    {
      ...maybeOptions,
      username: sanitizers.username(maybeOptions.username),
      token: sanitizers.token(maybeOptions.token),
    },
    {
      isKnown: false,
      isVerified: false,
      connectionTimeout: constants.CONNECTION_TIMEOUT,
      joinTimeout: constants.JOIN_TIMEOUT,
      onAuthenticationFailure: () => Promise.reject(),
    },
  )

  invariant(
    conformsTo(options, shape),
    '[twitch-js/Chat] options: Expected valid options',
  )

  return options
}

export const clientOptions = (
  maybeOptions: types.ClientOptions,
): types.ClientOptions => {
  const shape = {
    username: isString,
    token: isString,
    server: isString,
    port: isFinite,
    ssl: isBoolean,
    isKnown: isBoolean,
    isVerified: isBoolean,
  }

  const options: types.ClientOptions = defaults(
    {
      ...maybeOptions,
      username: sanitizers.username(maybeOptions.username),
      token: sanitizers.token(maybeOptions.token),
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
    conformsTo(options, shape),
    '[twitch-js/Chat/Client] options: Expected valid options',
  )

  return options
}
