import * as constants from '../constants'

export const isAuthenticationFailedMessage = (message: BaseMessage) =>
  message.command === constants.EVENTS.NOTICE &&
  message.channel === '' &&
  message.message === 'Login authentication failed'

export const getEventNameFromMessage = (message: BaseMessage) =>
  message.command || message.event || constants.EVENTS.ALL

export const isUserAnonymous = (value: string) =>
  constants.ANONYMOUS_USERNAME_RE.test(value)
