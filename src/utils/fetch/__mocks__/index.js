import responseRoot from './__fixtures__/kraken/root'
import response401 from './__fixtures__/kraken/401'
import response404 from './__fixtures__/kraken/404'
import parser from '../parser'

const fetch = jest.fn().mockImplementation((url /*, options, qsOptions */) => {
  switch (url) {
    case 'https://api.twitch.tv/kraken/401':
      return parser({
        ok: false,
        status: 401,
        json: () => Promise.resolve(response401),
      })
    case 'https://api.twitch.tv/kraken/404':
      return parser({
        ok: false,
        status: 404,
        json: () => Promise.resolve(response404),
      })
    default:
      return parser({ ok: true, json: () => Promise.resolve(responseRoot) })
  }
})

export default fetch
