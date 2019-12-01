import { BaseMessage } from '../../twitch'

import * as constants from '../constants'

export const isAuthenticationFailedMessage = (message?: BaseMessage) =>
  typeof message !== 'undefined' &&
  message.command === constants.EVENTS.NOTICE &&
  message.channel === '' &&
  message.message === 'Login authentication failed'

export const getEventNameFromMessage = (message: BaseMessage) =>
  typeof message !== 'undefined'
    ? message.command || message.event
    : constants.EVENTS.ALL

export const isUserAnonymous = (value: string) =>
  constants.ANONYMOUS_USERNAME_RE.test(value)
