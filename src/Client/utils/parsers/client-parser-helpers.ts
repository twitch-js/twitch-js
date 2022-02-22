import toLower from 'lodash/toLower'

export const generalTimestamp = (maybeTimestamp: string) => {
  const timestamp = new Date(parseInt(maybeTimestamp, 10))
  return timestamp.toString() !== 'Invalid Date' ? timestamp : new Date()
}

export const username = (...maybeUsernames: any[]): string =>
  maybeUsernames.reduce((maybeUsername, name) => {
    if (typeof name !== 'string') {
      return maybeUsername
    }

    if (name === 'tmi.twitch.tv') {
      return 'tmi.twitch.tv'
    }

    return toLower(name).split('.')[0]
  }, undefined)
