import { BaseMessage, Commands } from '../../twitch'

export const isAuthenticationFailedMessage = (message?: BaseMessage) =>
  typeof message !== 'undefined' &&
  message.command === Commands.NOTICE &&
  message.channel === '' &&
  message.message === 'Login authentication failed'
