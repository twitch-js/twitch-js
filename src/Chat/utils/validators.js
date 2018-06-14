import invariant from 'invariant'

import {
  conformsTo,
  defaultsDeep,
  isString,
  isFinite,
  isBoolean,
  isFunction,
} from 'lodash'

import * as constants from '../constants'
import * as sanitizers from './sanitizers'

const chatOptions = maybeOptions => {
  const shape = {
    username: isString,
    token: isString,
    connectionTimeout: isFinite,
    joinTimeout: isFinite,
    debug: isBoolean,
  }

  const options = defaultsDeep(
    {},
    { ...maybeOptions, oauth: sanitizers.oauth(maybeOptions.token) },
    {
      connectionTimeout: constants.CONNECTION_TIMEOUT,
      joinTimeout: constants.JOIN_TIMEOUT,
      debug: false,
    },
  )

  invariant(
    conformsTo(options, shape),
    '[twitch-js/Chat] options: Expected valid options',
  )

  return options
}

const clientOptions = maybeOptions => {
  const shape = {
    username: isString,
    oauth: isString,
    server: isString,
    port: isFinite,
    ssl: isBoolean,
  }

  const options = defaultsDeep(
    {},
    { ...maybeOptions, oauth: sanitizers.oauth(maybeOptions.token) },
    {
      server: constants.CHAT_SERVER,
      port: constants.CHAT_SERVER_SSL_PORT,
      ssl: true,
    },
  )

  invariant(
    conformsTo(options, shape),
    '[twitch-js/Chat/Client] options: Expected valid options',
  )

  return options
}

const queueOptions = options => {
  const shape = {
    sendFn: isFunction,
  }

  invariant(
    conformsTo(options, shape),
    '[twitch-js/Chat/Queue] options: Expected valid options',
  )
}

export { chatOptions, clientOptions, queueOptions }
