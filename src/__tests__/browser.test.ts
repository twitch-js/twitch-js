import TwitchJs from '../'
import * as exportsForBrowser from '../browser'

describe('TwitchJs for browser', () => {
  test('should default export TwitchJs class only', () => {
    expect(exportsForBrowser).toEqual({ default: TwitchJs })
  })
})
