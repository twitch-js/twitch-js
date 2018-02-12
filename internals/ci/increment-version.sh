#!/bin/bash

# Add GitHub deployment key.
# See https://goo.gl/cYHFm1 for more information.

# Decrypt the file containing the private key.
openssl aes-256-cbc \
  -K $encrypted_786809254db8_key \
  -iv $encrypted_786809254db8_iv \
  -in ".travis/github-deployment-key.enc" \
  -out "$SSH_FILE" -d

# Enable SSH authentication.
chmod 600 "$SSH_FILE" \
  && printf "%s\n" \
    "Host github.com" \
    "  IdentityFile $SSH_FILE" \
    "  LogLevel ERROR" >> ~/.ssh/config

# Set GitHub user for commits.
git config --global user.email "travis@travis-ci.org"
git config --global user.name "Travis CI"

# Use SSH origin.
git remote set-url origin git@github.com:twitch-apis/twitch-js.git

# Retrieve current version.
PACKAGE_VERSION=$(node -p "require('./package.json').version")
echo "Current version: $PACKAGE_VERSION"

# Determine next version.
if [[ $PACKAGE_VERSION =~ ^[0-9]\.[0-9]\.[0-9]$ ]]; then
  # Regular versions get a 'pre' version tag.
  NEXT_VERSION=`$(npm bin)/semver \
    $PACKAGE_VERSION \
    --increment prerelease \
    --preid pre`
else
  # Prerelease versions retain version tag.
  NEXT_VERSION=`$(npm bin)/semver $PACKAGE_VERSION --increment prerelease`
fi

# Incrememnt version and append [ci skip] to the commit message to prevent
# Travis CI from proccessing this build.
echo "Next version: $NEXT_VERSION"
npm version $NEXT_VERSION --message "$NEXT_VERSION [ci skip]"

# Travis CI should take care of deploying build to NPM from here.
