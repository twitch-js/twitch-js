#!/bin/bash

# Add GitHub deploy key.
$(npm bin)/set-up-ssh \
  --key "$encrypted_XXXXXXXXXXXX_key" \
  --iv "$encrypted_XXXXXXXXXXXX_iv" \
  --path-encrypted-key ".travis/github_deploy_key.enc"

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
