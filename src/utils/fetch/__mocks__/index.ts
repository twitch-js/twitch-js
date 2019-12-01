import { Response } from 'node-fetch'

import responseRoot from './__fixtures__/kraken/root'
import response401 from './__fixtures__/kraken/401'
import response404 from './__fixtures__/kraken/404'
import parser from '../parser'

const fetch = jest.fn().mockImplementation((url /*, options, qsOptions */) => {
  switch (url) {
    case 'https://api.twitch.tv/helix/401':
      return parser({
        url,
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: () => Promise.resolve(response401),
      } as Response)
    case 'https://api.twitch.tv/helix/404':
      return parser({
        url,
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: () => Promise.resolve(response404),
      } as Response)
    default:
      return parser({
        url,
        ok: true,
        json: () => Promise.resolve(responseRoot),
      } as Response)
  }
})

export default fetch
