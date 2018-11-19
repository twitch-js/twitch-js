import { isFinite, replace } from 'lodash'

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
  const [, username] = /([^!]+)/.exec(maybePrefix) || []
  return username
}

const userType = maybeUserType => {
  return typeof maybeUserType === 'string' ? maybeUserType : undefined
}

const broadcasterLanguage = maybeLanguage => {
  return typeof maybeLanguage === 'string' ? maybeLanguage : undefined
}

const badges = maybeBadges => {
  /**
   * Badges tag
   * @typedef {Object} BadgesTag
   * @property {boolean} [admin]
   * @property {number} [bits]
   * @property {boolean} [broadcaster]
   * @property {boolean} [globalMod]
   * @property {boolean} [moderator]
   * @property {boolean} [subscriber]
   * @property {boolean} [staff]
   * @property {boolean} [turbo]
   * @see https://dev.twitch.tv/docs/irc/tags/#privmsg-twitch-tags
   */
  return typeof maybeBadges === 'string'
    ? maybeBadges.split(',').reduce((parsed, badge) => {
        const [key, value] = badge.split('/')
        return { ...parsed, [key]: parseInt(value, 10) }
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
  badges,
  emotes,
  emoteSets,
  mods,
}
