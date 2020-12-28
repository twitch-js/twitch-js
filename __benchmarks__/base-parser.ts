/* eslint-disable no-console */

import Benchmark from 'benchmark'
import { parse } from 'irc-message'

const pattern = /^.+$/gm
const suite = new Benchmark.Suite()
const sample =
  '@badges=global_mod/1,turbo/1;color=#0D4200;display-name=dallas;emotes=25:0-4,12-16/1902:6-10;id=b34ccfc7-4977-403a-8a94-33c6bac34fb8;mod=0;room-id=1337;subscriber=0;tmi-sent-ts=1507246572675;turbo=1;user-id=1337;user-type=global_mod :ronni!ronni@ronni.tmi.twitch.tv PRIVMSG #dallas :Kappa Keepo Kappa'
const input = Array(1).fill(sample).join('\r\n')

suite
  .add('Replace and split', () => {
    const rawMessagesV = input
      .replace(/[\r\n]+/g, '\n')
      .replace(/\n+$/g, '')
      .split(/\n/g)

    return rawMessagesV.map((rawMessage) => parse(rawMessage))
  })
  .add('Split with for of', () => {
    const messages = []
    const rawMessagesV = input.split(/\r?\n/g)

    for (const rawMessage of rawMessagesV) {
      if (rawMessage.length > 0) {
        messages.push(parse(rawMessage))
      }
    }

    return messages
  })
  .add('Split with for forEach', () => {
    const messages = []
    const rawMessagesV = input.split(/\r?\n/g)

    rawMessagesV.forEach((rawMessage) => {
      if (rawMessage.length > 0) {
        messages.push(parse(rawMessage))
      }
    })

    return messages
  })
  .add('Split with for loop', () => {
    const messages = []
    const rawMessagesV = input.split(/\r?\n/g)

    for (const i = 0; i < rawMessagesV.length; i++) {
      const rawMessage = rawMessagesV[i]

      if (rawMessage.length > 0) {
        messages.push(parse(rawMessage))
      }
    }

    return messages
  })
  .add('Multiline regex with while loop', () => {
    const messages = []
    // eslint-disable-next-line no-var
    let match

    while ((match = pattern.exec(input))) {
      messages.push(parse(match[0]))
    }

    return messages
  })
  .add('Multiline regex with match', () => {
    const matches = input.match(pattern)

    return matches.map((rawMessage) => parse(rawMessage))
  })
  .on('cycle', (event) => {
    console.log(String(event.target))
  })
  .on('complete', function () {
    console.log('Fastest is %s', this.filter('fastest').map('name'))
  })
  .run()
