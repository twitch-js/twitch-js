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
  options: Partial<types.ChatOptions>,
): types.ChatOptions => {
  const shape = {
    username: (value: any) => isNil(value) || isString(value),
    token: (value: any) => isNil(value) || isString(value),
    isKnown: isBoolean,
    isVerified: isBoolean,
    connectionTimeout: isFinite,
    joinTimeout: isFinite,
    onAuthenticationFailure: isFunction,
  }

  const optionsWithDefaults = defaults(
    {
      ...options,
      username: options.username
        ? sanitizers.username(options.username)
        : undefined,
      token: options.token ? sanitizers.token(options.token) : undefined,
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
    conformsTo(optionsWithDefaults, shape),
    '[twitch-js/Chat] options: Expected valid options',
  )

  return optionsWithDefaults
}

export const channel = (channel: string): string => {
  channel = sanitizers.channel(channel)

  if (!channel) {
    throw new Error('Channel required')
  }

  return channel
}
