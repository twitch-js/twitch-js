const core = require('@actions/core')
const qs = require('qs')
const fetch = require('cross-fetch')

async function run() {
  try {
    const clientId = core.getInput('client-id', { required: true })
    const clientSecret = core.getInput('client-secret', { required: true })
    const refreshToken = core.getInput('refresh-token', { required: true })

    const query = qs.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    })

    const response = await fetch(`https://id.twitch.tv/oauth2/token?${query}`, {
      method: 'POST',
    })
    const json = await response.json()

    if (!response.ok) {
      throw new Error(json.message)
    }

    const accessToken = json.access_token
    core.setSecret(accessToken)
    core.exportVariable('TWITCH_ACCESS_TOKEN', accessToken)
  } catch (err) {
    core.setFailed(err.message)
  }
}

run()
