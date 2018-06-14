import { replace, toLower } from 'lodash'

const oauth = (oauth = '') => `oauth:${replace(oauth, /oauth:/gi, '')}`
const channel = (channel = '') => `#${replace(toLower(channel), /^#/g, '')}`

export { oauth, channel }
