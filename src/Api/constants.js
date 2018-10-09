export const HELIX_URL_ROOT = 'https://api.twitch.tv/helix'
export const KRAKEN_URL_ROOT = 'https://api.twitch.tv/kraken'

/** @typedef {string} ApiReadyState */
/**
 * API client ready state
 * @readonly
 * @enum {ApiReadyState}
 * @property {string} 0 not ready
 * @property {string} 1 ready
 * @property {string} 2 initialized
 */
export const READY_STATES = {
  0: 'NOT_READY',
  1: 'READY',
  2: 'INITIALIZED',
}
