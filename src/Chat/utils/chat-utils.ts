import { BaseMessage, Events, Commands } from '../../twitch'

import * as constants from '../chat-constants'

export const isAuthenticationFailedMessage = (message?: BaseMessage) =>
  typeof message !== 'undefined' &&
  message.command === Commands.NOTICE &&
  message.channel === '' &&
  message.message === 'Login authentication failed'

export const getEventNameFromMessage = (message: BaseMessage) =>
  typeof message !== 'undefined' ? message.command || message.event : Events.ALL

export const isUserAnonymous = (value: string) =>
  constants.ANONYMOUS_USERNAME_RE.test(value)
