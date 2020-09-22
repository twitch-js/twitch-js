import camelCase from 'lodash/camelCase'

import { ChatCommands } from '../../../twitch'

import * as commands from '../commands'

describe('Chat/utils/commands', () => {
  const channel = 'CHANNEL'

  describe('factory', () => {
    test('should create command methods on chat instance', () => {
      const args = ['arg1', 'arg2', 'arg3']

      const chatInstance = {
        say: jest.fn(),
      }

      commands.factory(chatInstance)

      Object.entries(ChatCommands).forEach(([key, command]) => {
        chatInstance[camelCase(key)](channel, ...args)

        expect(chatInstance.say).toHaveBeenLastCalledWith(
          channel,
          `/${command}`,
          ...args,
        )
      })
    })
  })

  describe('resolver', () => {
    const chatInstance = {
      say: jest.fn(),
      once: jest.fn(),
    }

    test('should return an array of promises', () => {
      Object.values(ChatCommands).forEach((command) => {
        const resolvers = commands.resolvers(chatInstance)(
          channel,
          `/${command}`,
        )

        const actual = resolvers.every(
          (resolver) => typeof resolver.then === 'function',
        )

        expect(actual).toBeTruthy()
      })
    })
  })
})
