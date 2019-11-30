import random from 'lodash-es/random'
import toLower from 'lodash-es/toLower'
import { ANONYMOUS_USERNAME } from '../constants'

export const channel = (value: any): string => {
  if (value == null) {
    return '#'
  }

  if (value.startsWith('#')) {
    return value
  }

  return toLower(`#${value}`)
}

export const token = (value: any): string => {
  if (value == null) {
    return 'TWITCHJS'
  }

  if (value.startsWith('oauth:')) {
    return value
  }

  return `oauth:${value}`
}

export const username = (value: any): string => {
  if (value == null || value === 'justinfan') {
    return `${ANONYMOUS_USERNAME}${random(80000, 81000)}`
  }

  return value
}
