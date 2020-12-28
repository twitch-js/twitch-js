# Contributing to TwitchJS

If you would like to contribute code you can do so through GitHub by forking the
repository and sending a pull request.

When submitting code, please make every effort to follow existing conventions
and style in order to keep the code as readable as possible.

## What you should know before contributing

All pull requests must:

1. Be titled in the following format: _Feature: feature description_, _Bugfix:
   bugfix description_ or _Chore: chore description_
2. Pass lint tests
3. Pass CI-CD tests
4. Maintain current test coverage
5. Receive at least one approval from an existing contributor
6. ... more to follow

If your PR is merged with relatively little-to-no assistance from an existing
contributors, **you will be granted contributor access**.

## Running E2E (end-to-end) tests locally

1. Go to https://twitchtokengenerator.com and generate tokens with the chat bot
   scope.
2. Create a `.env` file at the repository root with your Twitch username and the
   generated tokens from step #1. For example:
   ```bash
   TWITCH_USERNAME={YOUR_TWITCH_USERNAME}
   TWITCH_ACCESS_TOKEN=0123456789abcdefghijABCDEFGHIJ
   ```
3. Compile the library:
   ```bash
   $ yarn build
   ```
4. Run the E2E tests:
   ```bash
   $ yarn test:e2e
   ```

## License

By contributing your code, you agree to license your contribution under the
terms of the MIT License: http://opensource.org/licenses/MIT
