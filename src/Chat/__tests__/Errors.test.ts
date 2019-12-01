import * as constants from '../constants'
import * as Errors from '../Errors'

describe('Chat/Errors', () => {
  test('ParseError', () => {
    const parseError = new Error('PARSE_ERROR')
    const rawMessage = 'RAW_MESSAGE'
    const actual = new Errors.ParseError(parseError, rawMessage)

    expect(actual.message).toEqual('[TwitchJS] Parse error encountered [Chat]')
    expect(actual._raw).toEqual(rawMessage)
    expect(actual.command).toEqual(constants.EVENTS.PARSE_ERROR_ENCOUNTERED)
  })
})
