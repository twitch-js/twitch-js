import * as constants from '../constants'

const isAuthenticationFailedMessage = (message = {}) =>
  message.command === constants.EVENTS.NOTICE &&
  message.channel === '' &&
  message.message === 'Login authentication failed'

const getEventNameFromMessage = (message = {}) =>
  message.command || message.event || constants.EVENTS.ALL

const isUserAnonymous = value => constants.ANONYMOUS_USERNAME_RE.test(value)

export {
  isAuthenticationFailedMessage,
  getEventNameFromMessage,
  isUserAnonymous,
}
