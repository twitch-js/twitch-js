import { Response } from 'node-fetch'

import responseRoot from './__fixtures__/kraken/root.json'
import response401 from './__fixtures__/kraken/401.json'
import response404 from './__fixtures__/kraken/404.json'

const mockJson = jest.fn(() => Promise.resolve({ mock: true }))

const fetch = jest.fn().mockImplementation(
  (url /*, options, qsOptions */): Promise<Partial<Response>> => {
    switch (url) {
      case 'https://api.twitch.tv/helix/401':
        return Promise.resolve({
          url,
          ok: false,
          status: 401,
          statusText: 'Unauthorized',
          json: () => Promise.resolve(response401),
        })
      case 'https://api.twitch.tv/helix/404':
        return Promise.resolve({
          url,
          ok: false,
          status: 404,
          statusText: 'Not Found',
          json: () => Promise.resolve(response404),
        })
      case 'https://api.twitch.tv/kraken/':
        return Promise.resolve({
          url,
          ok: true,
          status: 200,
          statusText: 'OK',
          json: () => Promise.resolve(responseRoot),
        })
      default:
        return Promise.resolve({
          url,
          ok: true,
          status: 200,
          statusText: 'OK',
          json: mockJson,
        })
    }
  },
)

export { mockJson }
export default fetch
