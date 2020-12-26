import { parse } from 'tekko/dist/parse'
import camelcaseKeys from 'camelcase-keys'

import isEmpty from 'lodash/isEmpty'
import toLower from 'lodash/toLower'

import { BaseMessage, Commands, Events } from '../../../twitch'

import * as helpers from './helpers'

const baseParser = (rawMessages: string, username = ''): BaseMessage[] => {
  const rawMessagesArray = rawMessages.split(/\r?\n/g)

  return rawMessagesArray.reduce((messages, rawMessage) => {
    if (!rawMessage.length) {
      return messages
    }

    const {
      command,
      tags = {},
      prefix: { name, user, host } = {
        name: undefined,
        user: undefined,
        host: undefined,
      },
      params: [channel, message],
    } = parse(rawMessage)

    const timestamp = String(tags['tmi-sent-ts']) || Date.now().toString()

    const messageTags = isEmpty(tags)
      ? {}
      : (camelcaseKeys(tags) as { [key: string]: string })

    const messageUsername = helpers.username(
      host,
      name,
      user,
      messageTags.login,
      messageTags.username,
      messageTags.displayName,
    )

    const nextMessage = {
      _raw: rawMessage,
      timestamp: helpers.generalTimestamp(timestamp),
      command: command as Commands,
      event: command as Events,
      channel: channel !== '*' ? channel : '',
      username: messageUsername,
      isSelf:
        typeof messageUsername === 'string' &&
        toLower(username) === messageUsername,
      tags: messageTags,
      message,
    }

    return [...messages, nextMessage]
  }, [] as BaseMessage[])
}

export default baseParser
