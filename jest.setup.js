process.env = Object.assign(process.env, {
  // Disable logging during tests by default.
  CONSOLA_LEVEL: process.env.LOG_LEVEL || -1,
})
