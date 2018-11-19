import signale from 'signale'

signale.config({
  displayTimestamp: true,
})

const originalScope = signale.scope.bind(signale)

signale.scope = scope => originalScope(`twitch-js/${scope}`)

export default signale
