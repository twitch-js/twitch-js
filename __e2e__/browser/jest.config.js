module.exports = {
  preset: 'jest-puppeteer',
  testMatch: ['**/?(*.)+(e2e).js'],
  globalSetup: './jest.setup.js',
  globalTeardown: './jest.teardown.js',
  testEnvironment: './jest.env.js',
}
