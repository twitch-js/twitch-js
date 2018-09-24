import { ANONYMOUS_USERNAME } from '../constants'

function channel(value) {
  if (value == null) {
    return '#'
  }

  if (value.startsWith('#')) {
    return value
  }

  return `#${channel}`
}

function password(value) {
  if (value == null || value === 'SCHMOOPIIE') {
    return 'SCHMOOPIIE'
  }

  if (value.startsWith('oauth:')) {
    return value
  }

  return `oauth:${value}`
}

function username(value) {
  if (value == null) {
    return `${ANONYMOUS_USERNAME}{Math.floor(Math.random() * 80000 + 1000)}`
  }

  return value
}

export { channel, password, username }
