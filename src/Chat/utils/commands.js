import { camelCase, gt } from 'lodash'

import * as utils from '../../utils'
import * as constants from '../constants'

function commandCreator({ command, timeout, confirmations = [] }) {
  return (channel, ...args) => {
    const timeoutDelay =
      gt(timeout, 0) || confirmations.length
        ? utils.delayReject(
            timeout || constants.COMMAND_TIMEOUT,
            constants.ERROR_COMMAND_TIMED_OUT,
          )
        : Promise.resolve()

    const unrecognized = new Promise((resolve, reject) => {
      this.once(constants.NOTICE_MESSAGE_IDS.UNRECOGNIZED_COMMAND, message => {
        reject(constants.ERROR_COMMAND_UNRECOGNIZED)
      })
    })

    const confirmation = Promise.race(
      confirmations.map(
        ({ event, cb }) =>
          new Promise((resolve, reject) => {
            this.once(event, message => {
              if (typeof cb !== 'function') {
                return resolve(message)
              }

              const result = cb(message, command, ...args)
              return result === true ? resolve(message) : reject(result)
            })
          }),
      ),
    )

    const message = `/${command} ${args.join(' ')}`
    this.say(channel, message)

    return Promise.race([timeoutDelay, unrecognized, confirmation])
  }
}

function commandsFactory() {
  return Object.entries(commandMap).reduce(
    (commands, [command, commandCreatorArgs]) => ({
      ...commands,
      [command]: commandCreator.call(this, { ...commandCreatorArgs }),
    }),
    {},
  )
}

const commandMap = Object.entries(constants.CHAT_COMMANDS).reduce(
  (commands, [key, value]) => {
    switch (value) {
      case constants.CHAT_COMMANDS.BAN:
        return {
          ...commands,
          [camelCase(key)]: {
            command: value,
            confirmations: [
              {
                event: `${constants.COMMANDS.NOTICE}/${
                  constants.NOTICE_MESSAGE_IDS.BAN_SUCCESS
                }`,
              },
              {
                event: `${constants.COMMANDS.NOTICE}/${
                  constants.NOTICE_MESSAGE_IDS.ALREADY_BANNED
                }`,
              },
            ],
          },
        }
      case constants.CHAT_COMMANDS.EMOTE_ONLY:
        return {
          ...commands,
          [camelCase(key)]: {
            command: value,
            confirmations: [
              {
                event: `${constants.COMMANDS.NOTICE}/${
                  constants.NOTICE_MESSAGE_IDS.EMOTE_ONLY_ON
                }`,
              },
              {
                event: `${constants.COMMANDS.NOTICE}/${
                  constants.NOTICE_MESSAGE_IDS.ALREADY_EMOTE_ONLY_ON
                }`,
              },
            ],
          },
        }
      case constants.CHAT_COMMANDS.EMOTE_ONLY_OFF:
        return {
          ...commands,
          [camelCase(key)]: {
            command: value,
            confirmations: [
              {
                event: `${constants.COMMANDS.NOTICE}/${
                  constants.NOTICE_MESSAGE_IDS.EMOTE_ONLY_OFF
                }`,
              },
              {
                event: `${constants.COMMANDS.NOTICE}/${
                  constants.NOTICE_MESSAGE_IDS.ALREADY_EMOTE_ONLY_OFF
                }`,
              },
            ],
          },
        }
      case constants.CHAT_COMMANDS.MODS:
        return {
          ...commands,
          [camelCase(key)]: {
            command: value,
            confirmations: [
              {
                event: `${constants.COMMANDS.NOTICE}/${
                  constants.EVENTS.ROOM_MODS
                }`,
              },
            ],
          },
        }
      case constants.CHAT_COMMANDS.ME:
      case constants.CHAT_COMMANDS.CLEAR:
      case constants.CHAT_COMMANDS.COLOR:
      case constants.CHAT_COMMANDS.COMMERCIAL:
      case constants.CHAT_COMMANDS.FOLLOWERS_ONLY:
      case constants.CHAT_COMMANDS.FOLLOWERS_ONLY_OFF:
      case constants.CHAT_COMMANDS.HOST:
      case constants.CHAT_COMMANDS.MOD:
      case constants.CHAT_COMMANDS.PART:
      case constants.CHAT_COMMANDS.R9K:
      case constants.CHAT_COMMANDS.R9K_OFF:
      case constants.CHAT_COMMANDS.SLOW:
      case constants.CHAT_COMMANDS.SLOW_OFF:
      case constants.CHAT_COMMANDS.SUBSCRIBERS:
      case constants.CHAT_COMMANDS.SUBSCRIBERS_OFF:
      case constants.CHAT_COMMANDS.TIMEOUT:
      case constants.CHAT_COMMANDS.UNBAN:
      case constants.CHAT_COMMANDS.UNHOST:
      case constants.CHAT_COMMANDS.UNMOD:
      case constants.CHAT_COMMANDS.WHISPER:
      default:
        return {
          ...commands,
          [camelCase(key)]: {
            command: value,
            confirmations: [],
          },
        }
    }
  },
  {},
)

export { commandCreator, commandsFactory }
