export const HELIX_VERSION = 'helix'
export const HELIX_URL_ROOT = 'https://api.twitch.tv/helix'
export const HELIX_AUTHORIZATION_HEADER = 'Bearer'

export const KRAKEN_VERSION = 'kraken'
export const KRAKEN_URL_ROOT = 'https://api.twitch.tv/kraken'
export const KRAKEN_AUTHORIZATION_HEADER = 'OAuth'

/**
 * API client ready state
 * @alias ApiReadyState
 * @enum {number}
 */
const READY_STATES = {
  NOT_READY: 0,
  READY: 1,
  INITIALIZED: 2,
}

export { READY_STATES }
