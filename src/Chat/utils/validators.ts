import invariant from 'invariant'

import conformsTo from 'lodash/conformsTo'
import defaults from 'lodash/defaults'
import isString from 'lodash/isString'
import isFinite from 'lodash/isFinite'
import isFunction from 'lodash/isFunction'
import isBoolean from 'lodash/isBoolean'
import isNil from 'lodash/isNil'

import * as types from '../types'

import * as constants from '../constants'
import * as sanitizers from './sanitizers'

export const chatOptions = (
  maybeOptions: types.ChatOptions,
): types.ChatOptions => {
  const shape = {
    username: isString,
    token: (value: any) => isNil(value) || isString(value),
    isKnown: isBoolean,
    isVerified: isBoolean,
    connectionTimeout: isFinite,
    joinTimeout: isFinite,
    onAuthenticationFailure: isFunction,
  }

  const options: types.ChatOptions = defaults(
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
