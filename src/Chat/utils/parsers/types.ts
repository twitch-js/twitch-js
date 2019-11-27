import { isFinite, replace, camelCase } from 'lodash'

const generalString = maybeMessage => {
  return typeof maybeMessage === 'string'
    ? replace(maybeMessage, /\\[sn]/g, ' ')
    : undefined
}

const generalNumber = maybeNumber => {
  const number = parseInt(maybeNumber, 10)
  return isFinite(number) ? number : undefined
}

const generalBoolean = maybeBoolean => maybeBoolean === '1'

const generalTimestamp = maybeTimestamp => {
  const timestamp = new Date(parseInt(maybeTimestamp, 10))
  return timestamp.toString() !== 'Invalid Date' ? timestamp : new Date()
}

const usernameFromPrefix = maybePrefix => {
  if (typeof maybePrefix !== 'string') {
    return undefined
  }

  const [, username] = /([^!]+)/.exec(maybePrefix)
  return username
}

const userType = maybeUserType => {
  return typeof maybeUserType === 'string' ? maybeUserType : undefined
}

const broadcasterLanguage = maybeLanguage => {
  return typeof maybeLanguage === 'string' ? maybeLanguage : undefined
}

const followersOnly = maybeFollowersOnly => {
  const followersOnlyAsNumber = parseInt(maybeFollowersOnly, 10)

  if (followersOnlyAsNumber === 0) {
    return true
  } else if (followersOnlyAsNumber > 0) {
    return followersOnlyAsNumber
  }

  return false
}

const badges = maybeBadges => {
  /**
   * Badges tag
   * @typedef {Object} BadgesTag
   * @property {boolean} [admin]
   * @property {number} [bits]
   * @property {number} [bitsLeader]
   * @property {boolean} [broadcaster]
   * @property {boolean} [globalMod]
   * @property {boolean} [moderator]
   * @property {boolean} [partner]
   * @property {boolean} [premium]
   * @property {boolean} [staff]
   * @property {boolean} [subGifter]
   * @property {number} [subscriber]
   * @property {boolean} [turbo]
   * @property {boolean} [vip]
   * @see https://dev.twitch.tv/docs/irc/tags/#privmsg-twitch-tags
   */
  return typeof maybeBadges === 'string'
    ? maybeBadges.split(',').reduce((parsed, badge) => {
        const [rawKey, value] = badge.split('/')
        const key = camelCase(rawKey)

        switch (key) {
          // Booleans
          case 'admin':
          case 'broadcaster':
          case 'globalMod':
          case 'moderator':
          case 'partner':
          case 'premium':
          case 'staff':
          case 'subGifter':
          case 'turbo':
          case 'vip':
            return { ...parsed, [key]: generalBoolean(value) }
          // Numbers
          case 'bits':
          case 'bitsLeader':
          case 'subscriber':
            return { ...parsed, [key]: parseInt(value, 10) }
          default:
            return { ...parsed, [key]: value }
        }
      }, {})
    : {}
}

const emotes = maybeEmotes => {
  if (typeof maybeEmotes !== 'string') {
    return []
  }

  /**
   * Emote tag
   * @typedef {Object} EmoteTag
   * @property {string} id ID
   * @property {number} start Starting index
   * @property {number} end Ending index
   * @see https://dev.twitch.tv/docs/irc/tags/#privmsg-twitch-tags
   */
  return maybeEmotes.split('/').reduce((emoteTag, emoteIndices) => {
    const [id, indices] = emoteIndices.split(':')

    return [
      ...emoteTag,
      ...indices.split(',').map(index => {
        const [start, end] = index.split('-')
        return { id, start: parseInt(start, 10), end: parseInt(end, 10) }
      }),
    ]
  }, [])
}

const emoteSets = maybeEmoteSets => {
  return typeof maybeEmoteSets === 'string'
    ? maybeEmoteSets.split(',')
    : undefined
}

const mods = message => {
  const [, modList] = message.split(': ')
  return modList.split(', ')
}

export {
  generalString,
  generalNumber,
  generalBoolean,
  generalTimestamp,
  usernameFromPrefix,
  userType,
  broadcasterLanguage,
  followersOnly,
  badges,
  emotes,
  emoteSets,
  mods,
}
