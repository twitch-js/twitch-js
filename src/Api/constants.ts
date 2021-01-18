import { ApiSettings } from './types'

export const Settings: Record<'Helix' | 'Kraken', ApiSettings> = {
  Helix: {
    BaseUrl: 'https://api.twitch.tv/helix',
    AuthorizationHeader: 'Bearer',
  },
  Kraken: {
    BaseUrl: 'https://api.twitch.tv/kraken',
    AuthorizationHeader: 'OAuth',
  },
}
