import { random, toLower } from 'lodash'
import { ANONYMOUS_USERNAME } from '../constants'

function channel(value) {
  if (value == null) {
    return '#'
  }

  if (value.startsWith('#')) {
    return value
  }

  return toLower(`#${value}`)
}

function token(value) {
  if (value == null) {
    return 'TWITCHJS'
  }

  if (value.startsWith('oauth:')) {
    return value
  }

  return `oauth:${value}`
}

function username(value) {
  if (value == null || value === 'justinfan') {
    return `${ANONYMOUS_USERNAME}${random(80000, 81000)}`
  }

  return value
}

export { channel, token, username }
