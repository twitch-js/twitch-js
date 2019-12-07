import camelCase from 'lodash/camelCase'
import isFinite from 'lodash/isFinite'
import replace from 'lodash/replace'
import toLower from 'lodash/toLower'

import { Badges, BooleanBadges, NumberBadges, EmoteTag } from '../../../twitch'

export const generalString = (maybeMessage: string) => {
  return typeof maybeMessage === 'string'
    ? replace(maybeMessage, /\\[sn]/g, ' ')
    : undefined
}

export const generalNumber = (maybeNumber: string) => {
  const number = parseInt(maybeNumber, 10)
  return isFinite(number) ? number : undefined
}

export const generalBoolean = (maybeBoolean: string) => maybeBoolean === '1'

export const generalTimestamp = (maybeTimestamp: string) => {
  const timestamp = new Date(parseInt(maybeTimestamp, 10))
  return timestamp.toString() !== 'Invalid Date' ? timestamp : new Date()
}

export const userType = (maybeUserType: string) => {
  return typeof maybeUserType === 'string' ? maybeUserType : undefined
}

export const broadcasterLanguage = (maybeLanguage: string) => {
  return typeof maybeLanguage === 'string' ? maybeLanguage : undefined
}

export const followersOnly = (maybeFollowersOnly: string) => {
  const followersOnlyAsNumber = parseInt(maybeFollowersOnly, 10)

  if (followersOnlyAsNumber === 0) {
    return true
  } else if (followersOnlyAsNumber > 0) {
    return followersOnlyAsNumber
  }

  return false
}

/**
 * Badges tag
 * @see https://dev.twitch.tv/docs/irc/tags/#privmsg-twitch-tags
 */
export const badges = (maybeBadges: string): Partial<Badges> => {
  return typeof maybeBadges === 'string'
    ? maybeBadges.split(',').reduce((parsed, badge) => {
        const [rawKey, value] = badge.split('/')
        const key = camelCase(rawKey)

        if (BooleanBadges[key] === 'boolean') {
          return { ...parsed, [key]: generalBoolean(value) }
        }

        if (NumberBadges[key] === 'number') {
          return { ...parsed, [key]: parseInt(value, 10) }
        }

        return { ...parsed, [key]: value }
      }, {} as Badges)
    : {}
}

/**
 * Emote tag
 * @see https://dev.twitch.tv/docs/irc/tags/#privmsg-twitch-tags
 */
export const emotes = (maybeEmotes: string) => {
  if (typeof maybeEmotes !== 'string') {
    return []
  }

  return maybeEmotes.split('/').reduce((emoteTag, emoteIndices) => {
    const [id, indices] = emoteIndices.split(':')

    if (!id) {
      return emoteTag
    }

    return [
      ...emoteTag,
      ...indices.split(',').map(index => {
        const [start, end] = index.split('-')
        return { id, start: parseInt(start, 10), end: parseInt(end, 10) }
      }),
    ]
  }, [] as EmoteTag[])
}

export const emoteSets = (maybeEmoteSets: string) => {
  return typeof maybeEmoteSets === 'string' ? maybeEmoteSets.split(',') : []
}

export const mods = (message: string) => {
  const [, modList] = message.split(': ')
  return modList.split(', ')
}

export const username = (...maybeUsernames: any[]): string | undefined =>
  maybeUsernames.reduce((maybeUsername, name) => {
    if (typeof name !== 'string') {
      return maybeUsername
    }

    if (name === 'tmi.twitch.tv') {
      return 'tmi.twitch.tv'
    }

    return toLower(name).split('.')[0]
  }, undefined)
